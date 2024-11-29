import { z } from 'zod'

export const envSchema = z.object({
  GLOBAL_PREFIX: z.string(),
  NODE_ENV: z.string(),

  // Database
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PORT: z.coerce.number().default(3306),
  DATABASE_HOST: z.string(),

  // Jwt
  JWT_ACCESS_TOKEN_TIME: z.coerce.number().default(86400),
  JWT_SECRET_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),

  EMAIL_SENDER: z.string(),
})

export type Env = z.infer<typeof envSchema>
