import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>)
{
  await db.schema
    .createType('user_genders')
    .asEnum(['FEMENINO', 'MASCULINO', 'PREFIERO_NO_DECIR'])
    .execute();

  await db.schema
    .createType('user_roles')
    .asEnum(['ADMINISTRADOR', 'MODERADOR', 'ESTUDIANTE', 'DOCENTE'])
    .execute();

  await db.schema
    .createType('email_status')
    .asEnum(['NOT_VERIFIED', 'VERIFIED'])
    .execute();

  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`(gen_random_uuid())`))
    .addColumn('full_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('password', 'varchar(70)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('cedula', 'char(10)', (col) => col.notNull().unique())
    .addColumn('phone', 'varchar(15)', (col) => col.notNull())
    .addColumn('gender', sql`user_genders`, (col) => col.notNull())
    .addColumn('role', sql`user_roles`, (col) => col.notNull())
    .addColumn('email_status', sql`email_status`, (col) => col.notNull())
    .addColumn('date_created', 'timestamp', (col) => col.defaultTo(sql`(CURRENT_TIMESTAMP)`))
    .addColumn('date_updated', 'timestamp', (col) => col.defaultTo(sql`(CURRENT_TIMESTAMP)`))
    .execute();

  await db.schema.createIndex('idx_email').on('users').column('email').execute();
  await db.schema.createIndex('idx_cedula').on('users').column('cedula').execute();
}

export async function down(db: Kysely<any>)
{
  await db.schema.dropIndex('idx_email').execute();
  await db.schema.dropIndex('idx_cedula').execute();

  await db.schema.dropTable('users').execute();

  await db.schema.dropType('user_genders').execute();
  await db.schema.dropType('user_roles').execute();
  await db.schema.dropType('email_status').execute();
}
