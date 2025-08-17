
"use server";

import { personalizedEventRecommendations, PersonalizedEventRecommendationsInput } from "@/ai/flows/event-recommendations";
import type { PersonalizedEventRecommendationsOutput } from "@/ai/flows/event-recommendations";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc, serverTimestamp, query, where, getDocs, orderBy, arrayUnion, arrayRemove } from "firebase/firestore";
import { createEventSchema, CreateEventInput, updateEventSchema, UpdateEventInput, reviewSchema, ReviewInput } from "@/lib/schemas";


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
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
        const userData = userDoc.docs[0]?.data();
        
        if (!userData) {
            return { success: false, error: 'User not found.' };
        }

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
    