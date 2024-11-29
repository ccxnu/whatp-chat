import { Kysely, sql } from "kysely";

import { ENUM } from "../utils";

export async function up(db: Kysely<any>)
{
  await db.schema
    .createTable('course')
    .ifNotExists()
    .addColumn('id', 'char(36)', (col) => col.primaryKey().defaultTo(sql`(UUID())`))
    .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('price', sql`decimal(8, 2)`, (col) => col.notNull())
    .addColumn('duration', 'int2', (col) => col.notNull())
    .addColumn('category', 'varchar(255)', (col) => col.notNull())
    .addColumn('level', ENUM('PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'))
    .addColumn('startDate', 'date', (col) => col.notNull())
    .addColumn('isPopular', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('tags', 'json', (col) => col.notNull())
    .addColumn('modality', ENUM('PRESENCIAL', 'ONLINE', 'HIBRIDO'), (col) => col.defaultTo('ONLINE').notNull())
    .addColumn('date_created', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('date_updated', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('date_deleted', 'datetime')
    .execute();
}

export async function down(db: Kysely<any>)
{
  await db.schema.dropTable('course').execute();
}
