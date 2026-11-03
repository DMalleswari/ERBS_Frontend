import { z } from "zod";

export const createBookingSchema = z
  .object({
    resourceId: z.uuid("Select a resource"),
    startTime: z.string().min(1, "start time is required"),
    endTime: z.string().min(1, "end time is required"),
  })
  .refine((value) => new Date(value.startTime) < new Date(value.endTime), {
    message: "Start time must be before end time",
    path: ["endTime"],
  })
  .refine((value) => new Date(value.startTime).getTime() >= Date.now() - 60_000, {
    message: "Past bookings are not allowed",
    path: ["startTime"],
  });

export type CreateBookingValues = z.infer<typeof createBookingSchema>;
