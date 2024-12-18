import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>)
{
  await db.schema
    .createType('chat_author')
    .asEnum(['USER', 'MODEL'])
    .execute();

  await db.schema
    .createTable('chat_messages')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`(gen_random_uuid())`))
    .addColumn('session_id', 'uuid', (col) => col.references('users.id').notNull().onDelete('cascade'))
    .addColumn('author', sql`chat_author`, (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('dateCreated', 'timestamp', (col) => col.defaultTo(sql`(CURRENT_TIMESTAMP)`))
    .execute();

  await db.schema.createIndex('idx_session_id').on('chat_messages').column('session_id').execute();
  await db.schema.createIndex('idx_author').on('chat_messages').column('author').execute();
}

export async function down(db: Kysely<any>)
{
  await db.schema.dropIndex('idx_session_id').execute();
  await db.schema.dropIndex('idx_author').execute();

  await db.schema.dropTable('chat_messages').execute();

  await db.schema.dropType('chat_author').execute();
}
