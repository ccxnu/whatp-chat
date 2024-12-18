import { Injectable } from '@nestjs/common';

import { FacturationRepository, FindManyByFiltersParams } from '@/application/repositories/facturation.repository';
import { PaginationData } from '@/core/repositories/pagination-data';
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';
import { Facturation } from '@/domain/entities/facturation';
import { Database } from '@/infra/database/kysely/database';

import { KyselyFacturationMapper } from '../mappers/kysely-facturation.mapper';

@Injectable()
export class KyselyFacturationRepository implements FacturationRepository
{
  constructor(private readonly database: Database)
  {}

  async create(data: Facturation): Promise<void>
  {
    const facturation = KyselyFacturationMapper.toKysely(data);

    await this.database
      .insertInto('facturation')
      .values({
        ...facturation,
      })
      .executeTakeFirst()
  }

	async edit(data: Facturation): Promise<void>
  {
    data.updateFacturation();

    const { id, ...result } = KyselyFacturationMapper.toKysely(data);

    await this.database
      .updateTable('facturation')
      .set({
        ...result,
      })
      .where('id', '=', id)
      .executeTakeFirst()
  }

  async findById(id: string): Promise<Facturation | null>
  {
    const facturation = await this.database
      .selectFrom('facturation')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    if (!facturation) return null;

    return KyselyFacturationMapper.toDomain(facturation);
  }

  async findManyByQuery(params: QueryDataLimitParams): Promise<Facturation[]>
  {
    const { query, perPage } = params;

    const facturations = await this.database
      .selectFrom('facturation')
      .where((op) => op.or([
        op('legal_name', 'like', query),
        op('ruc_or_cedula', 'like', query),
        op('main_street', 'like', query),
        op('addrees_number', 'like', query),
      ]))
      .selectAll()
      .limit(perPage)
      .execute();

		return facturations.map((item) =>
    {
      return KyselyFacturationMapper.toDomain(item);
    })
  }

  async findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<Facturation[]>>
  {
    const { provincia, canton, isMember, page, perPage } = props;

    const skip = (page - 1) * perPage;

    let builder = this.database
      .selectFrom('facturation')

    if (provincia)
    {
      builder = builder.where('province', 'like', provincia)
    }

    if (canton)
    {
      builder = builder.where('canton', 'like', canton);
    }

    if (isMember !== undefined)
    {
      builder = builder.where('is_member_of_equinoccio_network', '=', isMember);
    }

    const { total }: any = await builder
      .select((op) => op.fn.countAll<number>().as("total"))
      .executeTakeFirst();

    const facturations = await builder
      .limit(perPage)
      .offset(skip)
      .selectAll()
      .execute();

		return {
			data: facturations.map((item) =>
      {
				return KyselyFacturationMapper.toDomain(item);
			}),
			perPage,
			totalPages: Math.ceil(total / perPage),
			totalItems: total,
		}
  }
}
