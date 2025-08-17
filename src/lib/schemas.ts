
import { z } from "zod";

// Schema for event creation form
export const createEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters long."),
  date: z.date(),
  location: z.string().min(3, "Location is required."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  price: z.preprocess(
    (val) => {
        if (typeof val === 'string') {
            if (val.trim() === '') return 0; // Treat empty string as 0
            const num = parseFloat(val);
            return isNaN(num) ? val : num; // Let Zod handle the NaN case
        }
        return val;
    },
    z.number({ invalid_type_error: "Price must be a number." }).min(0, "Price must be a positive number.")
  ),
  image: z.string().url("Please enter a valid image URL."),
  hostUid: z.string(),
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
    