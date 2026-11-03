import { z } from "zod";

export const resourceTypeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "code must be at least 2 characters")
    .max(40)
    .regex(/^[A-Za-z0-9_]+$/, "code must contain only letters, numbers, and underscores"),
  name: z.string().trim().min(1, "name is required").max(100),
  description: z.string().trim().max(500).optional(),
  isActive: z.boolean(),
});

export type ResourceTypeValues = z.infer<typeof resourceTypeSchema>;
