import { Injectable } from '@nestjs/common';

import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';


interface RecoverUserUseCaseRequest
{
	userId: string
}

type RecoverUserUseCaseResponse = Either<
	ResourceNotFoundError,
	object
>

@Injectable()
export class RecoverUserUseCase
{
	constructor(private userRepository: UserRepository)
  {}

	async execute({ userId }: RecoverUserUseCaseRequest):
    Promise<RecoverUserUseCaseResponse>
  {
		const user = await this.userRepository.findByIdOnDeleted(userId);

		if (!user)
    {
			return left(new ResourceNotFoundError());
		}

		await this.userRepository.recover(user);

		return right({})
	}
}
