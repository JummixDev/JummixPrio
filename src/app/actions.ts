
"use server";

import "dotenv/config";
import { personalizedEventRecommendations, PersonalizedEventRecommendationsInput } from "@/ai/flows/event-recommendations";
import type { PersonalizedEventRecommendationsOutput } from "@/ai/flows/event-recommendations";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc, serverTimestamp, query, where, getDocs, orderBy, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { createEventSchema, CreateEventInput, updateEventSchema, UpdateEventInput, reviewSchema, ReviewInput } from "@/lib/schemas";
import Stripe from 'stripe';

interface AIResult extends PersonalizedEventRecommendationsOutput {
  error?: string;
}

export async function getAIRecommendations(input: PersonalizedEventRecommendationsInput): Promise<AIResult> {
  try {
    const result = await personalizedEventRecommendations(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: "Failed to get recommendations. Please try again.", eventRecommendations: [] };
  }
}

export async function createEvent(eventData: CreateEventInput) {
    const validation = createEventSchema.safeParse(eventData);

    if (!validation.success) {
        return {
            success: false,
            // Return a string array of errors
            errors: validation.error.errors.map(e => e.message),
        };
    }
    
    try {
        const docRef = await addDoc(collection(db, "events"), {
            ...validation.data,
            // Convert date to a Firestore-compatible format
            date: validation.data.date.toISOString().split('T')[0],
            isFree: validation.data.price === 0,
             // Add mock data for fields that are not in the form yet
            hint: 'event photo',
            organizer: {
              name: 'A placeholder host',
              avatar: 'https://placehold.co/40x40.png',
              hint: 'person portrait',
              username: 'placeholderhost',
            },
            attendees: [],
            gallery: [],
        });
        
        return { success: true, eventId: docRef.id };
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false, errors: ["Failed to create event in the database."] };
    }
}

export async function updateEvent(eventData: UpdateEventInput) {
    const validation = updateEventSchema.safeParse(eventData);

    if (!validation.success) {
        return {
            success: false,
            errors: validation.error.errors.map(e => e.message),
        };
    }
    
    try {
        const { eventId, ...dataToUpdate } = validation.data;
        const eventRef = doc(db, "events", eventId);

        await updateDoc(eventRef, {
            ...dataToUpdate,
            date: dataToUpdate.date.toISOString().split('T')[0],
            isFree: dataToUpdate.price === 0,
        });
        
        return { success: true, eventId: eventId };
    } catch (error) {
        console.error("Error updating event:", error);
        return { success: false, errors: ["Failed to update event in the database."] };
    }
}

export async function sendMessage(conversationId: string, senderUid: string, text: string) {
    if (!conversationId || !senderUid || !text.trim()) {
        return { success: false, error: 'Invalid message data.' };
    }

    try {
        const messagesRef = collection(db, 'chats', conversationId, 'messages');
        await addDoc(messagesRef, {
            senderUid: senderUid,
            text: text,
            timestamp: serverTimestamp(),
        });

        // Also update the last message on the conversation document itself
        const conversationRef = doc(db, 'chats', conversationId);
        await updateDoc(conversationRef, {
            lastMessage: text,
            lastMessageTimestamp: serverTimestamp(),
        });

        return { success: true };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false, error: 'Failed to send message.' };
    }
}

export async function toggleEventInteraction(userId: string, eventId: string, type: 'liked' | 'saved') {
    if (!userId || !eventId || !type) {
        return { success: false, error: 'Invalid data provided.' };
    }

    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            return { success: false, error: 'User not found.' };
        }

        const userData = userDoc.data();
        const field = type === 'liked' ? 'likedEvents' : 'savedEvents';
        const isInteracted = userData[field]?.includes(eventId);

        await updateDoc(userRef, {
            [field]: isInteracted ? arrayRemove(eventId) : arrayUnion(eventId)
        });

        return { success: true, newState: !isInteracted };
    } catch (error) {
        console.error(`Error toggling ${type} event:`, error);
        return { success: false, error: `Failed to update your ${type} list.` };
    }
}

export async function submitReview(reviewData: ReviewInput) {
    const validation = reviewSchema.safeParse(reviewData);

    if (!validation.success) {
        return {
            success: false,
            errors: validation.error.errors.map(e => e.message),
        };
    }

    try {
        const reviewsRef = collection(db, 'users', validation.data.hostId, 'reviews');
        await addDoc(reviewsRef, {
            ...validation.data,
            createdAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error("Error submitting review:", error);
        return { success: false, errors: ["Failed to submit review."] };
    }
}


export async function createCheckoutSession(userId: string, eventId: string) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // 0. Check for necessary environment variables
    if (!stripeSecretKey) {
        console.error("Stripe secret key is not set in .env file.");
        return { success: false, error: "Payment system is not configured. Please contact support." };
    }
    if (!baseUrl) {
        console.error("NEXT_PUBLIC_BASE_URL is not set in .env file.");
        return { success: false, error: "Application base URL is not configured." };
    }
    
    // 1. Validate inputs
    if (!userId || !eventId) {
        return { success: false, error: 'User ID and Event ID are required.' };
    }

    try {
        // 2. Fetch event and user data from Firestore
        const eventRef = doc(db, 'events', eventId);
        const userRef = doc(db, 'users', userId);

        const [eventDoc, userDoc] = await Promise.all([getDoc(eventRef), getDoc(userRef)]);

        if (!eventDoc.exists()) {
            return { success: false, error: 'Event not found.' };
        }
        if (!userDoc.exists()) {
            return { success: false, error: 'User not found.' };
        }

        const event = eventDoc.data();
        const user = userDoc.data();

        // 3. Initialize Stripe
        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2024-06-20',
        });
        
        // Final safety check for price
        const priceInCents = Math.round((event.price || 0) * 100);
        if (isNaN(priceInCents)) {
             console.error(`Invalid price for event ${eventId}: ${event.price}. Cannot create checkout session.`);
             return { success: false, error: 'Event price is invalid. Cannot proceed with payment.' };
        }
        
        // 4. Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: event.name,
                            images: [event.image],
                            description: event.description,
                        },
                        unit_amount: priceInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/event/${eventId}?payment_success=true`,
            cancel_url: `${baseUrl}/event/${eventId}`,
            // We pass metadata to identify the user and event after the payment is successful
            metadata: {
                userId,
                eventId,
            },
        });

        return { success: true, sessionId: session.id, url: session.url };

    } catch (error: any) {
        console.error('Stripe session creation failed:', error);
        // Provide a more specific error message if available
        if (error instanceof Stripe.errors.StripeError) {
             return { success: false, error: `Stripe Error: ${error.message}` };
        }
        return { success: false, error: 'Could not create payment session.' };
    }
}
