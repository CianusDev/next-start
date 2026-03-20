import { z } from "zod";

// Server-side environment variables (sensitive, never exposed to client)
const serverEnvSchema = z.object({
  SESSION_SECRET: z
    .string({
      message: "SESSION_SECRET is required",
    })
    .min(32, {
      message: "SESSION_SECRET must be at least 32 characters long",
    }),
});

// Client-side environment variables (safe to expose to browser)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url({
    message: "NEXT_PUBLIC_API_URL must be a valid URL",
  }),
  NEXT_PUBLIC_APP_URL: z.url({
    message: "NEXT_PUBLIC_APP_URL must be a valid URL",
  }),
  NEXT_PUBLIC_APP_NAME: z.string({
    message: "NEXT_PUBLIC_APP_NAME is required",
  }),
});

const serverResult = serverEnvSchema.safeParse({
  SESSION_SECRET: process.env.SESSION_SECRET,
});

const clientResult = clientEnvSchema.safeParse({
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!serverResult.success || !clientResult.success) {
  const errors: string[] = [];

  if (!serverResult.success) {
    errors.push(
      ...serverResult.error.issues.map((issue) => {
        const key = issue.path.join(".");
        return `  ❌ ${key}: ${issue.message}`;
      }),
    );
  }

  if (!clientResult.success) {
    errors.push(
      ...clientResult.error.issues.map((issue) => {
        const key = issue.path.join(".");
        return `  ❌ ${key}: ${issue.message}`;
      }),
    );
  }

  console.error("\n🚨 Invalid environment variables:\n");
  console.error(errors.join("\n"));
  console.error("\n");

  process.exit(1);
}

export const serverEnv = serverResult.data;
export const clientEnv = clientResult.data;
