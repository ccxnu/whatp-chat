import { Injectable } from '@nestjs/common';

import { Encrypter } from '@/application/cryptography/encrypter';
import { HashComparer } from '@/application/cryptography/hash-compare';
import { InvalidCredentialsError } from '@/application/errors/invalid-credentials-error';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { EmailStatus } from '@/core/repositories/email-status';

interface AuthenticateUserUseCaseRequest
{
	username: string;
	password: string;
}

type AuthenticateUserUseCaseResponse = Either<
	InvalidCredentialsError | UnauthorizedError,
	{
		user: {};
	}
>

@Injectable()
export class AuthenticateUserUseCase
{
	constructor(
		private studentRepository: UserRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	)
  {}

	async execute({ username, password }: AuthenticateUserUseCaseRequest):
    Promise<AuthenticateUserUseCaseResponse>
  {
		const user = await this.studentRepository.findByUsername(username);

		if (!user)
    {
			return left(new InvalidCredentialsError());
		}

		if (user.dateDeleted !== null)
    {
			return left(new InvalidCredentialsError());
		}

    if (user.emailStatus === EmailStatus.NOT_VERIFIED)
    {
			return left(new UnauthorizedError("Debe verificar su email"));
    }

		const hasValidPassword = await this.hashComparer.compare(
			password,
			user.password,
		)

		if (!hasValidPassword)
    {
			return left(new InvalidCredentialsError())
		}

		const accessToken = await this.encrypter.encrypt({
			sub: user.id.toString(),
      email: user.email,
			role: user.role,
		})

		if (!accessToken)
    {
			return left(new UnauthorizedError());
		}

    const response = {
      id: user.id.toString(),
      rol: user.role,
      accessToken
    }

		return right({ user: response })
	}
}
