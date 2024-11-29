import { Injectable } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { FacturationRepository } from '@/application/repositories/facturation.repository';
import { Either, left, right } from '@/core/either';
import { Facturation } from '@/domain/entities/facturation';

interface UseCaseRequest
{
	query: string;
	limit: number;
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

	async execute({ query, limit }: UseCaseRequest): Promise<UseCaseResponse>
  {
		if (query.length < 2)
		{
			return left(new InvalidQueryLengthError(2))
		}

		const facturations = await this.facturationRepository.findManyByQuery({
      query,
      limit
		})

		return right({ data: facturations })
	}
}
