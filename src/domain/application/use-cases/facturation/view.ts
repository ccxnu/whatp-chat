import { Injectable } from '@nestjs/common';

import { FacturationRepository } from '@/application/repositories/facturation.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Facturation } from '@/domain/entities/facturation';

interface UseCaseRequest
{
	facturationId: string
}

type UseCaseResponse = Either<
	ResourceNotFoundError,
	{
		facturation: Facturation;
	}
>

@Injectable()
export class ViewFacturationUseCase
{
	constructor(private facturationRepository: FacturationRepository)
  {}

	async execute({
		facturationId,
	}: UseCaseRequest): Promise<UseCaseResponse>
  {
		const facturation = await this.facturationRepository.findById(facturationId);

		if (!facturation)
    {
			return left(new ResourceNotFoundError());
		}

		return right({ facturation })
	}
}
