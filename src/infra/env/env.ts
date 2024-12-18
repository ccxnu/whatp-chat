import typia from 'typia';

export class Env
{
  // Global
  GLOBAL_PREFIX!: string;
  NODE_ENV!: string;

  // Database
  DATABASE_USER!: string;
  DATABASE_PASSWORD!: string;
  DATABASE_NAME!: string;
  DATABASE_PORT!: number;
  DATABASE_HOST!: string;

  // Redis
  REDIS_HOST!: string;
  REDIS_PORT!: number;
  REDIS_TTL!: number;
  REDIS_DB!: number;

  // Jwt
  JWT_ACCESS_TOKEN_TIME!: number;
  JWT_SECRET_KEY!: string;
  JWT_PUBLIC_KEY!: string;

  // Email
  EMAIL_SENDER!: string;
}

export const validateEnv = (env: Record<string, string>) =>
{
  const ENV_KEYS = Object.keys(new Env());

  const filteredEnv: Record<string, string | number> = Object.fromEntries(
    Object.entries(env).filter(([key]) => ENV_KEYS.includes(key))
  );

  if (filteredEnv.DATABASE_PORT)
  {
    filteredEnv.DATABASE_PORT = Number.parseInt(filteredEnv.DATABASE_PORT as string, 10);
  }

  if (filteredEnv.JWT_ACCESS_TOKEN_TIME)
  {
    filteredEnv.JWT_ACCESS_TOKEN_TIME = Number.parseInt(filteredEnv.JWT_ACCESS_TOKEN_TIME as string, 10);
  }

  if (filteredEnv.REDIS_PORT)
  {
    filteredEnv.REDIS_PORT = Number.parseInt(filteredEnv.REDIS_PORT as string, 10);
  }

  if (filteredEnv.REDIS_TTL)
  {
    filteredEnv.REDIS_TTL = Number.parseInt(filteredEnv.REDIS_TTL as string, 10);
  }

  if (filteredEnv.REDIS_DB)
  {
    filteredEnv.REDIS_DB = Number.parseInt(filteredEnv.DB as string, 10);
  }

  return typia.assertEquals<Env>(filteredEnv);
};
