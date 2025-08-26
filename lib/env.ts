import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  SITE_BASE_URL: z.string().url(),
  // Email provider (one required)
  RESEND_API_KEY: z.string().optional(),
  POSTMARK_SERVER_TOKEN: z.string().optional(),
  // Rate limiting (optional for dev)
  RATE_LIMIT_REDIS_URL: z.string().url().optional(),
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
}).refine(
  (data) => data.RESEND_API_KEY || data.POSTMARK_SERVER_TOKEN,
  {
    message: "Either RESEND_API_KEY or POSTMARK_SERVER_TOKEN must be provided",
    path: ["RESEND_API_KEY", "POSTMARK_SERVER_TOKEN"],
  }
);

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
}

export const env = validateEnv();
