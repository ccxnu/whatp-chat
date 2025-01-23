import { z } from 'zod'

export const envSchema = z.object(
  {
    NODE_ENV: z.string(),

    COMMAND_PREFIX: z.string().default('.'),
    LOG_UPDATES: z.coerce.boolean(),
    VERBOSE_UPDATES: z.coerce.boolean(),
    EVENTS_TO_LOG: z.string(),

    // WppServer
    WPPCONNECT_SESSION: z.string(),
    WPPCONNECT_BASE: z.string(),
    WPPCONNECT_TOKEN: z.string(),
  }
)

export type Env = z.infer<typeof envSchema>
