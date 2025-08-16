
"use server";

import { personalizedEventRecommendations, PersonalizedEventRecommendationsInput } from "@/ai/flows/event-recommendations";
import type { PersonalizedEventRecommendationsOutput } from "@/ai/flows/event-recommendations";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { z } from "zod";

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

// Schema for event creation form
export const createEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters long."),
  date: z.date(),
  location: z.string().min(3, "Location is required."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  image: z.string().url("Please enter a valid image URL."),
  hostUid: z.string(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

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
