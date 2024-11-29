import { Kysely } from 'kysely';

import { ENUM } from '../utils';

export async function up(db: Kysely<any>)
{
  await db.schema
    .alterTable('user')
    .addColumn('city', 'varchar(255)', (col) => col.notNull())
    .addColumn('has_disability', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('education_level', ENUM('SECUNDARIA', 'UNIVERSITARIA', 'POSTGRADO'), (col) => col.notNull())
    .addColumn('participation_in_cooperative', ENUM('SOCIO', 'DIRECTIVO', 'EMPLEADO'), (col) => col.notNull())
    .addColumn('job_position',
               ENUM(
                 'Atención al cliente',
                 'Auditoría',
                 'Contabilidad/Financiera',
                 'Directivos/Asambleístas',
                 'Gerencia General',
                 'Negocios y/o Crédito',
                 'Recursos Humanos',
                 'Sistemas/Tecnología',
                 'Marketing/Mercadeo',
                 'Riegos',
                 'Otro Cargo'
               ), (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>)
{
  db.schema
    .alterTable('user')
    .dropColumn('city')
    .dropColumn('has_disability')
    .dropColumn('education_level')
    .dropColumn('participation_in_cooperative')
    .dropColumn('job_position')
}
