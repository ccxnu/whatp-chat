import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>)
{
  await db.schema
    .createTable('enrollment')
    .ifNotExists()
    .addColumn('id', 'char(36)', (col) => col.primaryKey().defaultTo(sql`(UUID())`))
    .addColumn('user_id', 'char(36)', (col) => col.references('user.id').notNull().onDelete('cascade'))
    .addColumn('course_id', 'char(36)', (col) => col.references('course.id').notNull().onDelete('cascade'))
    .addColumn('has_access', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('is_completed', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('date_created', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('date_updated', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>)
{
  await db.schema.dropTable('enrollment').execute();
}
