import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>)
{
  await db.schema
    .createTable('certificate')
    .ifNotExists()
    .addColumn('id', 'char(36)', (col) => col.primaryKey().defaultTo(sql`(UUID())`))
    .addColumn('enrollment_id', 'char(36)', (col) => col.references('enrollment.id').notNull().onDelete('cascade'))
    .addColumn('num_downloads', 'int2', (col) => col.notNull().defaultTo(0))
    .addColumn('date_created', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('date_updated', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>)
{
  await db.schema.dropTable('certificate').execute();
}
