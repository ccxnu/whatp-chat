import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>)
{
  await db.schema
    .createTable('facturation')
    .ifNotExists()
    .addColumn('id', 'char(36)', (col) => col.primaryKey().defaultTo(sql`(UUID())`))
    .addColumn('legal_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('ruc_or_cedula', 'varchar(13)', (col) => col.notNull())
    .addColumn('phone_number', 'varchar(15)', (col) => col.notNull())
    .addColumn('accounting_email', 'varchar(255)', (col) => col.notNull())
    .addColumn('province', 'varchar(150)', (col) => col.notNull())
    .addColumn('canton', 'varchar(150)', (col) => col.notNull())
    .addColumn('main_street', 'varchar(255)', (col) => col.notNull())
    .addColumn('addrees_number', 'varchar(255)', (col) => col.notNull())
    .addColumn('secondary_street', 'varchar(255)', (col) => col.notNull())
    .addColumn('is_member_of_equinoccio_network', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('date_created', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('date_updated', 'datetime', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();


  await db.schema
    .alterTable('user')
    .addColumn('facturation_id', 'char(36)', (col) => col.references('facturation.id').onDelete('cascade'))
    .execute();
}

export async function down(db: Kysely<any>)
{
  db.schema.alterTable('user').dropColumn('facturation_id');

  await db.schema.dropTable('facturation').execute();
}
