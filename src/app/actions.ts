

'use server';

import "dotenv/config";
import type { EventSearchOutput } from "@/ai/flows/event-search";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc, serverTimestamp, query, where, getDocs, orderBy, arrayUnion, arrayRemove, getDoc, setDoc, Transaction, runTransaction } from "firebase/firestore";
import { createEventSchema, CreateEventInput, updateEventSchema, UpdateEventInput, reviewSchema, ReviewInput, storySchema, StoryInput, OnboardingProfileInput, onboardingProfileSchema } from "@/lib/schemas";
import Stripe from 'stripe';
import { uploadFile } from "@/services/storage";




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
        const { images, ...eventDetails } = validation.data;

        // 1. Upload all images and get their URLs
        const imageUrls = await Promise.all(
            images.map(async (dataUri, index) => {
                 // Convert data URI to a Buffer
                const base64Data = dataUri.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                const fileExtension = dataUri.substring(dataUri.indexOf('/') + 1, dataUri.indexOf(';'));
                
                const fileName = `event_${Date.now()}_${index}.${fileExtension}`;
                const filePath = `events/${eventDetails.hostUid}/${fileName}`;
                
                // The uploadFile function in this project should be adapted to handle Buffers or Blobs.
                // Assuming uploadFile is modified to accept a buffer and a file path.
                return uploadFile(buffer, filePath);
            })
        );
        
        const coverImage = imageUrls[0];
        const galleryImages = imageUrls.slice(1);


        // 2. Create event document in Firestore
        const docRef = await addDoc(collection(db, "events"), {
            ...eventDetails,
            image: coverImage, // Use the first uploaded image URL as the main image
            gallery: galleryImages, // Use the rest for the gallery
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
        const { eventId, images, ...dataToUpdate } = validation.data;
        const eventRef = doc(db, "events", eventId);
        
        // This is a simplified update. A real implementation would need to handle
        // uploading new images, deleting old ones, and merging URLs.
        const image = images?.[0] || '';
        const gallery = images?.slice(1) || [];

        await updateDoc(eventRef, {
            ...dataToUpdate,
            date: dataToUpdate.date.toISOString().split('T')[0],
            isFree: dataToUpdate.price === 0,
            image: image,
            gallery: gallery,
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
        
        await runTransaction(db, async (transaction: Transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw "User not found.";
            }

            const field = type === 'liked' ? 'likedEvents' : 'savedEvents';
            const currentList = userDoc.data()?.[field] || [];
            const isInteracted = currentList.includes(eventId);

            if (isInteracted) {
                // If it's already in the array, remove it.
                transaction.update(userRef, { [field]: arrayRemove(eventId) });
            } else {
                // If it's not in the array, add it.
                transaction.update(userRef, { [field]: arrayUnion(eventId) });
            }
        });

        return { success: true, newState: !((await getDoc(userRef)).data()?.[type === 'liked' ? 'likedEvents' : 'savedEvents'] || []).includes(eventId) };

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
                bookingId: `${userId}_${eventId}`,
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


export async function createStory(storyData: StoryInput) {
    const validation = storySchema.safeParse(storyData);
    if (!validation.success) {
        return { success: false, errors: validation.error.errors.map(e => e.message) };
    }

    try {
        const { userId, imageDataUri, caption } = validation.data;

        // Correctly handle the data URI on the server
        const base64Data = imageDataUri.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const fileType = imageDataUri.substring(imageDataUri.indexOf('/') + 1, imageDataUri.indexOf(';'));

        // Upload buffer to storage
        const filePath = `stories/${userId}/story_${Date.now()}.${fileType}`;
        const imageUrl = await uploadFile(buffer, filePath);

        // Save to Firestore
        await addDoc(collection(db, "stories"), {
            userId,
            imageUrl,
            caption: caption || '',
            createdAt: serverTimestamp(),
        });

        return { success: true };
    } catch (error) {
        console.error("Error creating story:", error);
        return { success: false, error: "Could not post your story." };
    }
}


export async function requestToBook(userId: string, eventId: string, hostUsername: string | undefined) {
    if (!userId || !eventId || !hostUsername) {
        return { success: false, error: 'Missing required information.' };
    }

    try {
        // Check if user has completed onboarding
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists() || !userDoc.data()?.onboardingComplete) {
            return { success: false, error: 'onboarding_required' };
        }

        const bookingId = `${userId}_${eventId}`;
        const bookingRef = doc(db, "bookings", bookingId);
        const bookingDoc = await getDoc(bookingRef);

        if (bookingDoc.exists()) {
            return { success: false, error: 'You have already sent a request for this event.' };
        }

        // Fetch event details
        const eventDoc = await getDoc(doc(db, "events", eventId));

        if (!eventDoc.exists()) {
            return { success: false, error: 'Event not found.' };
        }
        const eventData = eventDoc.data();
        const userData = userDoc.data();

        await setDoc(bookingRef, {
            userId,
            eventId,
            hostId: eventData.hostUid,
            status: 'pending',
            createdAt: serverTimestamp(),
            // Denormalize data for easier display in host dashboard
            eventName: eventData.name,
            eventDate: eventData.date,
            eventLocation: eventData.location,
            eventImage: eventData.image,
            eventHint: eventData.hint,
            eventPrice: eventData.price,
            userName: userData.displayName,
            userAvatar: userData.photoURL,
            userHint: 'person portrait', // Assuming a default hint
            userUsername: userData.username
        });

        return { success: true };
    } catch (error) {
        console.error("Error creating booking request:", error);
        return { success: false, error: 'Failed to send booking request.' };
    }
}


export async function completeOnboardingProfile(userId: string, data: OnboardingProfileInput) {
    if (!userId) {
        return { success: false, error: "User ID is missing." };
    }

    const validation = onboardingProfileSchema.safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: validation.error.errors.map((e) => e.message).join(", "),
        };
    }
    
    // Check if username is already taken
    const usernameQuery = query(collection(db, "users"), where("username", "==", validation.data.username));
    const usernameSnapshot = await getDocs(usernameQuery);
    if (!usernameSnapshot.empty && usernameSnapshot.docs[0].id !== userId) {
        return { success: false, error: "This username is already taken. Please choose another one." };
    }


    try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            ...validation.data,
            interests: validation.data.interests?.split(',').map(i => i.trim()).filter(Boolean) || [],
            onboardingComplete: true,
        });
        return { success: true };
    } catch (error) {
        console.error("Error completing onboarding profile:", error);
        return { success: false, error: "Failed to update profile in the database." };
    }
}


// Admin actions
export async function updateUserStatus(userId: string, status: 'Active' | 'Banned') {
    if (!userId) return { success: false, error: "User ID is required." };
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { status: status });
        return { success: true };
    } catch (error) {
        console.error("Error updating user status:", error);
        return { success: false, error: "Failed to update user status." };
    }
}

export async function updateHostVerification(userId: string, action: 'approve' | 'deny' | 'revoke') {
     if (!userId) return { success: false, error: "User ID is required." };

     try {
        const userRef = doc(db, 'users', userId);
        let updateData = {};

        switch(action) {
            case 'approve':
                updateData = { isVerifiedHost: true, hostApplicationStatus: 'approved' };
                break;
            case 'deny':
                updateData = { isVerifiedHost: false, hostApplicationStatus: 'rejected' };
                break;
            case 'revoke':
                 updateData = { isVerifiedHost: false, hostApplicationStatus: 'none' };
                break;
            default:
                return { success: false, error: "Invalid action." };
        }

        await updateDoc(userRef, updateData);
        return { success: true };

     } catch(error) {
         console.error(`Error during host verification action '${action}':`, error);
         return { success: false, error: "Failed to update host verification status." };
     }
}
    

    

    
