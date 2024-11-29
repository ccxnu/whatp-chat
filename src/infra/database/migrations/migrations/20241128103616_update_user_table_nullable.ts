import { Kysely } from 'kysely';

import { ENUM } from '../utils';

export async function up(db: Kysely<any>)
{
  await db.schema
    .alterTable('user')
    .modifyColumn('city', 'varchar(255)')
    .modifyColumn('has_disability', 'boolean')
    .modifyColumn('education_level', ENUM('SECUNDARIA', 'UNIVERSITARIA', 'POSTGRADO'))
    .modifyColumn('participation_in_cooperative', ENUM('SOCIO', 'DIRECTIVO', 'EMPLEADO'))
    .modifyColumn('job_position',
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
               ))
    .execute();
}
