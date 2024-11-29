import { Provider } from '@nestjs/common';
import { MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

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

    const dialect = new MysqlDialect({
      pool: createPool({
        database,
        host,
        user,
        password,
        port,
        connectionLimit: 10,
      })
    })

    return new Database({ dialect });
  },
};
