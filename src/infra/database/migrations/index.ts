import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { promises as fs } from 'fs';
import { FileMigrationProvider,Kysely, Migrator, PostgresDialect } from 'kysely';
import * as path from 'path';
import { Pool } from 'pg';

config();

const configService = new ConfigService();

async function migrateToLatest()
{
  const host = configService.get('DATABASE_HOST');
  const port = configService.get('DATABASE_PORT');
  const user = configService.get('DATABASE_USER');
  const password = configService.get('DATABASE_PASSWORD');
  const database = configService.get('DATABASE_NAME');

  const db = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({
        host,
        port,
        user,
        password,
        database,
      }),
    })
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((migrationResult) =>
  {
    if (migrationResult.status === 'Success')
    {
      console.log(`Migration "${migrationResult.migrationName}" was executed successfully`);
    }
    else if (migrationResult.status === 'Error')
    {
      console.error(`Failed to execute migration "${migrationResult.migrationName}"`);
    }
  });

  if (error)
  {
    console.error('Failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
