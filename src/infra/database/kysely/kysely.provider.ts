import { Provider } from '@nestjs/common';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { EnvService } from '@/infra/env/env.service';

import { Database } from './database';

export const DatabaseProvider: Provider =
{
  inject: [EnvService],
  provide: Database,
  useFactory: (env: EnvService) =>
  {
    const host = env.get('DATABASE_HOST');
    const port = env.get('DATABASE_PORT');
    const user = env.get('DATABASE_USER');
    const password = env.get('DATABASE_PASSWORD');
    const database = env.get('DATABASE_NAME');

    const pool =  new Pool({
      host,
      port,
      user,
      password,
      database,
    });

    const dialect = new PostgresDialect({ pool });
    const db = new Database({ dialect });

    // Verifica la conexión a la base de datos
    // eslint-disable-next-line
    pool.query(`SELECT 1`, function(err) {
      if (err) console.error('DATABASE CONNECTION ERROR', err);
    });

    return db;
  },
};
