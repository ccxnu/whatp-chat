import { Injectable } from '@nestjs/common';

import { FindManyByFiltersParams, UserRepository } from '@/application/repositories/user.repository';
import { PaginationData } from '@/core/repositories/pagination-data';
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';
import { User } from '@/domain/entities/user';
import { UserDetails } from '@/domain/value-objects/user-details';
import { Database } from '@/infra/database/kysely/database';

import { KyselyUserMapper } from '../mappers/kysely-user.mapper';
import { KyselyUserDetailsMapper } from '../mappers/kysely-user-details';

@Injectable()
export class KyselyUserRepository implements UserRepository
{
  constructor(private readonly database: Database)
  {}

  async findById(id: string): Promise<User | null>
  {
    const user = await this.database
      .selectFrom('user')
      .where('id', '=', id)
      .where('date_deleted', 'is', null)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    return KyselyUserMapper.toDomain(user);
  }

  async findByIdOnDeleted(id: string): Promise<User | null>
  {
    const user = await this.database
      .selectFrom('user')
      .where('id', '=', id)
      .where('date_deleted', 'is not', null)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    return KyselyUserMapper.toDomain(user);
  }

  async findByIdWithDetails(id: string): Promise<UserDetails | null>
  {
    const user = await this.database
      .selectFrom('user')
      .leftJoin('facturation', 'facturation.id', 'user.facturation_id')
      .where('user.id', '=', id)
      .where('date_deleted', 'is', null)
      .selectAll('user')
      .select([
        'facturation.id as facturation_id',
        'facturation.legal_name',
        'facturation.ruc_or_cedula',
        'facturation.phone_number',
        'facturation.accounting_email',
        'facturation.province',
        'facturation.canton',
        'facturation.main_street',
        'facturation.addrees_number',
        'facturation.secondary_street',
        'facturation.is_member_of_equinoccio_network',
      ])
      .executeTakeFirst();

      console.log(user)

    if (!user) return null;

    return KyselyUserDetailsMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null>
  {
    const user = await this.database
      .selectFrom('user')
      .where('username', '=', username)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    return KyselyUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null>
  {
    const user = await this.database
      .selectFrom('user')
      .where('email', '=', email)
      .where('date_deleted', 'is', null)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    return KyselyUserMapper.toDomain(user);
  }

  async findByUnique(unique: string): Promise<User | null>
  {
    const user = await this.database
      .selectFrom('user')
      .where((op) => op.or([
        op('cedula', '=', unique),
        op('email', '=', unique),
        op('username', '=', unique)
      ]))
      .where('date_deleted', 'is', null)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    return KyselyUserMapper.toDomain(user);
  }

  async findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<UserDetails[]>>
  {
    const {
      hasDisability,
      educationLevel,
      participation,
      jobPosition,
      role,
      deleted,
      page,
      perPage
    } = props;

    const skip = (page - 1) * perPage;

    let builder = this.database
      .selectFrom('user')
      .where('date_deleted', deleted ? 'is not' : 'is', null)

    if (hasDisability !== undefined)
    {
      builder = builder.where('has_disability', '=', hasDisability);
    }

    if (educationLevel)
    {
      builder = builder.where('education_level', '=', educationLevel);
    }

    if (participation)
    {
      builder = builder.where('participation_in_cooperative', '=', participation);
    }

    if (jobPosition)
    {
      builder = builder.where('job_position', '=', jobPosition);
    }

    if (role)
    {
      builder = builder.where('role', '=', role)
    }


    const { countPeople } = await builder
      .select((op) => op.fn.countAll<number>().as("countPeople"))
      .executeTakeFirst();

    const people = await builder
      .limit(perPage)
      .offset(skip)
      .selectAll()
      .execute();

		return {
			data: people.map((item) =>
      {
				return KyselyUserDetailsMapper.toDomain(item);
			}),
			perPage,
			totalPages: Math.ceil(countPeople / perPage),
			totalItems: countPeople,
		}

  }

  async findManyBySearchQueries(params: QueryDataLimitParams): Promise<UserDetails[]>
  {
    const { query, limit } = params;

    const people = await this.database
      .selectFrom('user')
      .where('date_deleted', 'is', null)
      .where((op) => op.or([
        op('first_names', 'like', `%${query}%`),
        op('last_names', 'like', `%${query}%`),
        op('username', 'like', `%${query}%`),
        op('cedula', 'like', `%${query}%`),
        op('city', 'like', `%${query}%`),
      ]))
      .limit(limit)
      .selectAll()
      .execute();

		return people.map((item) =>
    {
      return KyselyUserDetailsMapper.toDomain(item);
    })
  }

  async create(person: User): Promise<void>
  {
		const data = KyselyUserMapper.toKysely(person);

    await this.database
      .insertInto('user')
      .values({ ...data })
      .executeTakeFirstOrThrow()
	}

	async edit(person: User): Promise<void>
  {
		person.updateUser()

		const { id, ...data } = KyselyUserMapper.toKysely(person);

		await this.database
      .updateTable('user')
      .set({ ...data })
      .where('id', '=', id)
      .executeTakeFirst();
	}

	async editPassword(person: User): Promise<void>
  {
		person.updateUser()

		const { id, password, date_updated } = KyselyUserMapper.toKysely(person);

		await this.database
      .updateTable('user')
      .set({ password, date_updated })
      .where('id', '=', id)
      .executeTakeFirst();
	}

	async delete(person: User): Promise<void>
  {
		person.deleteUser()

		const { id, date_deleted } = KyselyUserMapper.toKysely(person);

		await this.database
      .updateTable('user')
      .set({ date_deleted })
      .where('id', '=', id)
      .executeTakeFirst();
	}

	async recover(person: User): Promise<void>
  {
		person.recoverUser()

		const { id, date_deleted } = KyselyUserMapper.toKysely(person);

		await this.database
      .updateTable('user')
      .set({ date_deleted })
      .where('id', '=', id)
      .executeTakeFirst();
	}

}
