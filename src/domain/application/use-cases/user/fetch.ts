import { Injectable } from '@nestjs/common';

import { MinQuerySearchNotProviedError } from '@/application/errors/expected-one-search-param-error';
import { FindManyByFiltersParams, UserRepository } from '@/application/repositories/user.repository';
import { Either, right } from '@/core/either';
import { PaginationData } from '@/core/repositories/pagination-data';
import { UserDetails } from '@/domain/value-objects/user-details';

interface FetchUserUseCaseRequest extends FindManyByFiltersParams
{}

type FetchUserUseCaseResponse = Either<
	MinQuerySearchNotProviedError,
	PaginationData<UserDetails[]>
>

@Injectable()
export class FetchUserUseCase
{
	constructor(private userRepository: UserRepository)
  {}

	async execute({ ...props }: FetchUserUseCaseRequest): Promise<FetchUserUseCaseResponse>
  {
		const result = await this.userRepository.findManyByFilters({ ...props })

		return right(result)
	}
}
