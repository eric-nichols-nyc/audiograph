import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXT_PUBLIC_SPOTIFY_SECRET: z.string().min(1),
    KV_REST_API_URL: z.string().url(),
    KV_REST_API_TOKEN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SPOTIFY_ID: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SPOTIFY_ID: process.env.NEXT_PUBLIC_SPOTIFY_ID,
    NEXT_PUBLIC_SPOTIFY_SECRET: process.env.NEXT_PUBLIC_SPOTIFY_SECRET,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  },
});
