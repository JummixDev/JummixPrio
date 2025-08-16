
import { z } from "zod";

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

// Schema for updating an existing event
export const updateEventSchema = createEventSchema.extend({
    eventId: z.string(),
}).omit({ hostUid: true }); // hostUid cannot be changed

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

    