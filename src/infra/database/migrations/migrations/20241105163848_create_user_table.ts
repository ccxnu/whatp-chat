import { Kysely, sql } from "kysely";

import { ENUM } from "../utils";

export async function up(db: Kysely<any>)
{
  await db.schema
    .createTable('user')
    .ifNotExists()
    .addColumn('id', 'char(36)', (col) => col.primaryKey().defaultTo(sql`(UUID())`))
    .addColumn('first_names', 'varchar(255)', (col) => col.notNull())
    .addColumn('last_names', 'varchar(255)', (col) => col.notNull())
    .addColumn('username', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('cedula', 'char(10)', (col) => col.notNull().unique())
    .addColumn('phone', 'varchar(15)', (col) => col.notNull())
    .addColumn('birth_date', 'date', (col) => col.notNull())
    .addColumn('gender', ENUM('FEMENINO', 'MASCULINO', 'PREFIERO_NO_DECIR'), (col) => col.defaultTo('PREFIERO_NO_DECIR').notNull())
    .addColumn('role', ENUM('ADMINISTRADOR', 'ESTUDIANTE', 'INSTRUCTOR'), (col) => col.defaultTo('ESTUDIANTE').notNull())
    .addColumn('email_status', ENUM('NOT_VERIFIED', 'VERIFIED'), (col) => col.defaultTo('NOT_VERIFIED').notNull())
    .addColumn('date_created', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('date_updated', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('date_deleted', 'datetime')
    .execute();
}

export async function down(db: Kysely<any>)
{
  await db.schema.dropTable('user').execute();
}
