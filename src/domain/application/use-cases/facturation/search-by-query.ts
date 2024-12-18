import { Injectable } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { FacturationRepository } from '@/application/repositories/facturation.repository';
import { Either, left, right } from '@/core/either';
import { Facturation } from '@/domain/entities/facturation';

interface UseCaseRequest
{
	query: string;
	perPage: number;
}

type UseCaseResponse = Either<
	InvalidQueryLengthError,
	{
		data: Facturation[];
	}
>

@Injectable()
export class SearchByQueryFacturationUseCase
{
	constructor(private readonly facturationRepository: FacturationRepository)
  {}

	async execute({ query, perPage }: UseCaseRequest): Promise<UseCaseResponse>
  {
		if (query && query.length < 2)
		{
			return left(new InvalidQueryLengthError(2))
		}

		const facturations = await this.facturationRepository.findManyByQuery({
      query,
      perPage,
      page: 1,
		})

		return right({ data: facturations })
	}
}
