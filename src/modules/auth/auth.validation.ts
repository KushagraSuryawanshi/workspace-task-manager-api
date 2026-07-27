import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().pipe(z.email())

export const signupSchema = z.strictObject({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: emailSchema,
  password: z.string().min(8).max(128),
});
export const loginSchema = z.strictObject({
  email: emailSchema,
  password: z.string().min(1)
});

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>