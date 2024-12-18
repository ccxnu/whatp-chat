import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>)
{
  await db.schema
    .createTable('chat_sessions')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`(gen_random_uuid())`))
    .addColumn('user_id', 'uuid', (col) => col.references('users.id').notNull().onDelete('cascade'))
    .addColumn('startedAt', 'timestamp', (col) => col.defaultTo(sql`(CURRENT_TIMESTAMP)`))
    .addColumn('closedAt', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>)
{
  await db.schema.dropTable('chat_sessions').execute();
}
