import { Injectable } from '@nestjs/common';

import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface DeleteUserUseCaseRequest
{
	userId: string;
}

type DeleteUserUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class DeleteUserUseCase
{
	constructor(private userRepository: UserRepository)
  {}

	async execute({ userId }: DeleteUserUseCaseRequest):
    Promise<DeleteUserUseCaseResponse>
  {
		const user = await this.userRepository.findById(userId);

		if (!user)
    {
			return left(new ResourceNotFoundError());
		}

		await this.userRepository.delete(user);

		return right({})
	}
}
