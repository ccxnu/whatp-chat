import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>)
{
  await db.schema
    .createTable('email_verification')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`(gen_random_uuid())`))
    .addColumn('user_id', 'uuid', (col) => col.references('users.id').notNull().onDelete('cascade'))
    .addColumn('email_token', 'char(7)', (col) => col.notNull())
    .addColumn('date_created', 'timestamp', (col) => col.defaultTo(sql`(CURRENT_TIMESTAMP)`))
    .addColumn('date_deleted', 'timestamp')
    .execute();
}

export async function down(db: Kysely<any>)
{
  await db.schema.dropTable('email_verification').execute();
}
