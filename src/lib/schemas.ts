

import { z } from "zod";

// Helper for parsing numbers from various input types
const numberPreprocessor = z.preprocess(
    (val) => {
        if (typeof val === 'string') {
            if (val.trim() === '') return undefined; // Treat empty string as undefined so optional works
            const num = parseFloat(val);
            return isNaN(num) ? val : num; // Let Zod handle the NaN case
        }
        if (val === undefined || val === null) return undefined;
        return val;
    },
    z.number({ invalid_type_error: "Must be a number." }).min(0, "Must be a positive number.")
);


// Schema for event creation form
export const createEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters long."),
  date: z.date(),
  location: z.string().min(3, "Location is required."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  price: numberPreprocessor.default(0),
  images: z.array(z.string().refine(val => val.startsWith('data:image/'), {
    message: 'Each image must be a valid data URI.',
  })).min(1, "At least one image is required.").max(5, "You can upload a maximum of 5 images."),
  hostUid: z.string(),
  capacity: numberPreprocessor.optional(),
  expenses: numberPreprocessor.optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Schema for updating an existing event
export const updateEventSchema = createEventSchema.extend({
    eventId: z.string(),
}).omit({ hostUid: true }); // hostUid cannot be changed

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const reviewSchema = z.object({
  hostId: z.string(),
  reviewerId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters long.").max(500, "Review must not exceed 500 characters."),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const storySchema = z.object({
    userId: z.string(),
    imageDataUri: z.string().refine(val => val.startsWith('data:image/'), {
        message: 'Image data must be a valid data URI',
    }),
    caption: z.string().max(280, "Caption cannot exceed 280 characters.").optional(),
});

export type StoryInput = z.infer<typeof storySchema>;

// Schema for the extended onboarding profile
export const onboardingProfileSchema = z.object({
    displayName: z.string().min(3, { message: "Display name must be at least 3 characters." }),
    username: z.string().min(3, { message: "Username must be at least 3 characters." }).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
    photoURL: z.string().url({ message: "A valid profile picture URL is required." }),
    bio: z.string().max(160, { message: "Bio cannot be longer than 160 characters." }).optional(),
    interests: z.string().optional(),
});

export type OnboardingProfileInput = z.infer<typeof onboardingProfileSchema>;
    

    

    