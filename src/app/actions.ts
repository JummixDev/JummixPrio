
"use server";

import { personalizedEventRecommendations, PersonalizedEventRecommendationsInput } from "@/ai/flows/event-recommendations";
import type { PersonalizedEventRecommendationsOutput } from "@/ai/flows/event-recommendations";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { createEventSchema, CreateEventInput, updateEventSchema, UpdateEventInput } from "@/lib/schemas";


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

    