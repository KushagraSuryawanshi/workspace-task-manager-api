import z from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must contain at least 32 characters"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const message = z.prettifyError(parsedEnv.error);

  throw new Error(`Invalid environment configuration: \n ${message}`);
}

export const env = parsedEnv.data;
