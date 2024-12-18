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
      .selectFrom('users')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    return KyselyUserMapper.toDomain(user);
  }

  async findByIdOnDeleted(id: string): Promise<User | null>
  {
    const user = await this.database
      .selectFrom('users')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    return KyselyUserMapper.toDomain(user);
  }

  async findByIdWithDetails(id: string): Promise<UserDetails | null>
  {
    const user = await this.database
      .selectFrom('users')
      .where('users.id', '=', id)
      .selectAll('users')
      .executeTakeFirst();

      console.log(user)

    if (!user) return null;

    return KyselyUserDetailsMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null>
  {
    const user = await this.database
      .selectFrom('users')
      .where('email', '=', email)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    return KyselyUserMapper.toDomain(user);
  }

  async findByCedula(cedula: string): Promise<User | null>
  {
    const user = await this.database
      .selectFrom('users')
      .where('cedula', '=', cedula)
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    return KyselyUserMapper.toDomain(user);
  }


  async findByUnique(unique: string): Promise<User | null>
  {
    const user = await this.database
      .selectFrom('users')
      .where((op) => op.or([
        op('cedula', '=', unique),
        op('email', '=', unique),
      ]))
      .selectAll()
      .executeTakeFirst();

    if (!user) return null;

    return KyselyUserMapper.toDomain(user);
  }

  async findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<UserDetails[]>>
  {
    const { role, page, perPage } = props;

    const skip = (page - 1) * perPage;

    let builder = this.database
      .selectFrom('users')

    if (role)
    {
      builder = builder.where('role', '=', role)
    }

    const count = await builder
      .select((op) => op.fn.countAll<number>().as("total"))
      .executeTakeFirst();

    const totalItems: number = count?.total ? Number(count.total) : 0;

    const people = await builder
      .limit(perPage)
      .offset(skip)
      .selectAll()
      .execute();

		return {
			data: people.map((item) => KyselyUserDetailsMapper.toDomain(item)),
			perPage,
			totalItems,
			totalPages: Math.ceil(totalItems / perPage),
		}
  }

  async findManyBySearchQueries(params: QueryDataLimitParams): Promise<UserDetails[]>
  {
    const { query, perPage } = params;

    const people = await this.database
      .selectFrom('users')
      .where((op) => op.or([
        op('full_name', 'like', `%${query}%`),
        op('cedula', 'like', `%${query}%`),
      ]))
      .limit(perPage)
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
      .insertInto('users')
      .values({ ...data })
      .executeTakeFirstOrThrow()
	}

	async edit(person: User): Promise<void>
  {
		person.updateUser()

		const { id, ...data } = KyselyUserMapper.toKysely(person);

		await this.database
      .updateTable('users')
      .set({ ...data })
      .where('id', '=', id)
      .executeTakeFirst();
	}

	async editPassword(person: User): Promise<void>
  {
		person.updateUser()

		const { id, password, date_updated } = KyselyUserMapper.toKysely(person);

		await this.database
      .updateTable('users')
      .set({ password, date_updated })
      .where('id', '=', id)
      .executeTakeFirst();
	}

	async delete(person: User): Promise<void>
  {
		const { id } = KyselyUserMapper.toKysely(person);

		await this.database
      .deleteFrom('users')
      .where('id', '=', id)
      .executeTakeFirst();
	}

	async recover(person: User): Promise<void>
  {

		const { id } = KyselyUserMapper.toKysely(person);

		await this.database
      .deleteFrom('users')
      .where('id', '=', id)
      .executeTakeFirst();
	}

}
