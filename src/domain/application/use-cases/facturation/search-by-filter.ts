import { Injectable } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { FacturationRepository, FindManyByFiltersParams } from '@/application/repositories/facturation.repository';
import { Either, right } from '@/core/either';
import { PaginationData } from '@/core/repositories/pagination-data';
import { Facturation } from '@/domain/entities/facturation';

interface UseCaseRequest extends FindManyByFiltersParams
{}

type UseCaseResponse = Either<
	InvalidQueryLengthError,
	PaginationData<Facturation[]>
>

@Injectable()
export class SearchByFilterFacturationUseCase
{
	constructor(private readonly facturationRepository: FacturationRepository)
  {}

	async execute({
    provincia,
    canton,
    isMember,
    page,
    perPage,
  }: UseCaseRequest): Promise<UseCaseResponse>
  {
		//if (provincia.length < 2 || canton.length < 2)
		//{
		//	return left(new InvalidQueryLengthError(2))
		//}

		const result = await this.facturationRepository.findManyByFilters({
      provincia,
      canton,
      isMember,
      page,
			perPage,
		})

		return right(result)
	}
}
