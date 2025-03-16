import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXT_PUBLIC_SPOTIFY_SECRET: z.string().min(1),
    REDIS_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_SPOTIFY_ID: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SPOTIFY_ID: process.env.NEXT_PUBLIC_SPOTIFY_ID,
    NEXT_PUBLIC_SPOTIFY_SECRET: process.env.NEXT_PUBLIC_SPOTIFY_SECRET,
    REDIS_URL: process.env.REDIS_URL,
  },
});
