import { Injectable } from '@nestjs/common';

import { HashGenerator } from '@/application/cryptography/hash-generator';
import { InvalidCredentialsError } from '@/application/errors/invalid-credentials-error';
import { MailerRepository } from '@/application/mailer/mailer';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { RandomPassword } from '@/core/entities/random-value';
import { EmailStatus } from '@/core/repositories/email-status';

interface ForgotPasswordUseCaseRequest
{
  email: string;
  ip: string;
  userAgent: string;
}

type ForgotPasswordUseCaseResponse = Either<
	InvalidCredentialsError,
  object
>

@Injectable()
export class ForgotPasswordUseCase
{
	constructor(
    private readonly userRepository: UserRepository,
		private readonly hashGenerator: HashGenerator,
		private readonly mailerRepository: MailerRepository
  )
  {}

	async execute({ email, ip, userAgent }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseResponse>
  {
		const user = await this.userRepository.findByEmail(email);

		if (!user)
    {
			return left(new InvalidCredentialsError('El correo eléctronico no es válido'));
		}

		if (user.emailStatus === EmailStatus.NOT_VERIFIED)
    {
			return left(new InvalidCredentialsError('El usuario no está verificado'));
		}

    const temporalPassword = new RandomPassword().toString();

		user.password = await this.hashGenerator.hash(temporalPassword);

		await this.userRepository.editPassword(user)

    await this.mailerRepository.sendForgotPasswordEmail(user, temporalPassword, ip, userAgent);

		return right({});
	}
}
