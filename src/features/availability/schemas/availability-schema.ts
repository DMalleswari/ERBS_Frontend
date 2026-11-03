import { z } from "zod";

export const availabilitySchema = z.object({
  resourceId: z.uuid("Select a resource"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
});

export type AvailabilityValues = z.infer<typeof availabilitySchema>;
