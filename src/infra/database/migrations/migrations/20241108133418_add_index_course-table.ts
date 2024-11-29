import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void>
{
  await sql`ALTER TABLE course ADD FULLTEXT INDEX full_text_name_des (name, description);`
  .execute(db);
}

export async function down(db: Kysely<any>): Promise<void>
{
  db.schema.alterTable('course').dropIndex('full_text_name_des');
}
