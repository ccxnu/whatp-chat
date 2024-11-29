import { Injectable } from '@nestjs/common';

import { MinQuerySearchNotProviedError } from '@/application/errors/expected-one-search-param-error';
import { FindManyByFiltersParams, UserRepository } from '@/application/repositories/user.repository';
import { Either, right } from '@/core/either';
import { PaginationData } from '@/core/repositories/pagination-data';
import { UserRoles } from '@/core/repositories/roles';
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

	async execute({
    hasDisability,
    educationLevel,
    participation,
    jobPosition,
		deleted = false,
    role = UserRoles.ESTUDIANTE,
		page,
		perPage,
	}: FetchUserUseCaseRequest): Promise<FetchUserUseCaseResponse>
  {
		const result = await this.userRepository.findManyByFilters({
      hasDisability,
      educationLevel,
      participation,
      jobPosition,
      role,
			deleted,
			page,
			perPage,
		})

		return right(result)
	}
}
