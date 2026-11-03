import { z } from "zod";

export const resourceSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(120),
  description: z.string().trim().max(1000).optional(),
  resourceTypeId: z.uuid("Select a resource type"),
  capacity: z.coerce.number().int().positive("capacity must be a positive integer"),
  location: z.string().trim().min(1, "location is required").max(200),
  isActive: z.boolean(),
});

export type ResourceValues = z.infer<typeof resourceSchema>;
