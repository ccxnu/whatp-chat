import { PaginationData } from '@/core/repositories/pagination-data';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';
import { Facturation } from '@/domain/entities/facturation';

export type FindManyByFiltersParams = PaginationParams & {
  provincia?: string;
  canton?: string;
  isMember?: boolean;
}

export abstract class FacturationRepository
{
  abstract create(data: Facturation): Promise<void>;
	abstract edit(data: Facturation): Promise<void>;

  abstract findById(id: string): Promise<Facturation | null>;
  abstract findManyByQuery(params: QueryDataLimitParams): Promise<Facturation[]>;
  abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<Facturation[]>>;
}

