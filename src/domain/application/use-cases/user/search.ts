import { Injectable } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';
import { UserDetails } from '@/domain/value-objects/user-details';

type SearchUserUseCaseResponse = Either<
	InvalidQueryLengthError,
	{
		users: UserDetails[];
	}
>

@Injectable()
export class SearchUserUseCase
{
	constructor(private userRepository: UserRepository)
  {}

	async execute({
		query,
    page,
    perPage
	}: QueryDataLimitParams): Promise<SearchUserUseCaseResponse>
  {
		if (query && query.length < 2)
    {
			return left(new InvalidQueryLengthError(2));
		}

		const users = await this.userRepository.findManyBySearchQueries({
      query,
      page,
      perPage
	  })

		return right({ users })
	}
}
