import { z } from "zod";

export const strongPasswordSchema = z
  .string()
  .min(8, "password must be at least 8 characters")
  .max(72, "password must be at most 72 characters")
  .regex(/[A-Z]/, "password must include an uppercase letter")
  .regex(/[a-z]/, "password must include a lowercase letter")
  .regex(/[0-9]/, "password must include a number")
  .regex(/[^A-Za-z0-9]/, "password must include a special character");

export const passwordSchema = z
  .string()
  .min(8, "password must be at least 8 characters")
  .max(72, "password must be at most 72 characters");

export const nameSchema = z.string().trim().min(1, "name is required").max(100);
export const emailSchema = z.email("email must be valid");

export const PASSWORD_HINT = "8–72 characters with an uppercase letter, a lowercase letter, a number, and a special character.";
