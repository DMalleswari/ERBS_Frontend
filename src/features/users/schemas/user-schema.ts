import { z } from "zod";
import { emailSchema, nameSchema, strongPasswordSchema } from "@/shared/schemas/common";

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: strongPasswordSchema,
});

export const updateUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type UpdateUserValues = z.infer<typeof updateUserSchema>;
