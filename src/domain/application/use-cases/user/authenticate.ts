import { Injectable } from '@nestjs/common';

import { Encrypter } from '@/application/cryptography/encrypter';
import { HashComparer } from '@/application/cryptography/hash-compare';
import { InvalidCredentialsError } from '@/application/errors/invalid-credentials-error';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { EmailStatus } from '@/domain/enums/user-email-status';

interface UseCaseRequest
{
	email: string;
	password: string;
}

type UseCaseResponse = Either<
	InvalidCredentialsError | UnauthorizedError,
	{
		accessToken: string;
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

	async execute({ email, password }: UseCaseRequest): Promise<UseCaseResponse>
  {
		const user = await this.studentRepository.findByEmail(email);

		if (!user)
    {
			return left(new InvalidCredentialsError('El usuario no existe'));
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

		return right({ accessToken })
	}
}
