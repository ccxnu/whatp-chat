import { Injectable } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { UserDetails } from '@/domain/value-objects/user-details';

interface SearchUserUseCaseRequest
{
	query: string;
	limit: number;
}

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
		limit,
	}: SearchUserUseCaseRequest): Promise<SearchUserUseCaseResponse>
  {
		if (query.length < 2)
    {
			return left(new InvalidQueryLengthError(2));
		}

		const users = await this.userRepository.findManyBySearchQueries({
      query,
      limit,
	  })

		return right({ users })
	}
}
