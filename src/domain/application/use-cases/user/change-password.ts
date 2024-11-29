import { Injectable } from '@nestjs/common';

import { HashGenerator } from '@/application/cryptography/hash-generator';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface ChangeUserPasswordUseCaseRequest
{
	userId: string
	password: string
}

type ChangeUserPasswordUseCaseResponse = Either<
	ResourceNotFoundError,
	object
>

@Injectable()
export class ChangeUserPasswordUseCase
{
	constructor(
		private userRepository: UserRepository,
		private hashGenerator: HashGenerator,
	)
  {}

	async execute(
    { userId, password }: ChangeUserPasswordUseCaseRequest
  ):
    Promise<ChangeUserPasswordUseCaseResponse>
  {
		const user = await this.userRepository.findById(userId);

		if (!user)
    {
			return left(new ResourceNotFoundError());
		}

		user.password = await this.hashGenerator.hash(password);

		await this.userRepository.editPassword(user)

		return right({})
	}
}
