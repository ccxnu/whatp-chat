import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>)
{
  await db.schema
    .createTable('email_verification')
    .ifNotExists()
    .addColumn('id', 'char(36)', (col) => col.primaryKey().defaultTo(sql`(UUID())`))
    .addColumn('user_id', 'char(36)', (col) => col.references('user.id').notNull().onDelete('cascade'))
    .addColumn('email_token', 'char(7)', (col) => col.notNull())
    .addColumn('date_created', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('date_deleted', 'datetime')
    .execute();
}

export async function down(db: Kysely<any>)
{
  await db.schema.dropTable('email_verification').execute();
}
