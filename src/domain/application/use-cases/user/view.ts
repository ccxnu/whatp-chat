import { Injectable } from '@nestjs/common'

import { UserRepository } from '@/application/repositories/user.repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserDetails } from '@/domain/value-objects/user-details'


interface ViewUserUseCaseRequest
{
	userId: string
}

type ViewUserUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		user: UserDetails;
	}
>

@Injectable()
export class ViewUserUseCase
{
	constructor(private userRepository: UserRepository)
  {}

	async execute({
		userId,
	}: ViewUserUseCaseRequest): Promise<ViewUserUseCaseResponse>
  {
		const user = await this.userRepository.findByIdWithDetails(userId);

		if (!user)
    {
			return left(new ResourceNotFoundError());
		}

		return right({ user })
	}
}
