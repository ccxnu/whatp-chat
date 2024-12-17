import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/application/errors/invalid-credentials-error';
import { EmailVerificationRepository } from '@/application/repositories/email-verification.repository';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { DateFormat } from '@/core/entities/date';
import { EmailStatus } from '@/domain/enums/user-email-status';

interface VerifyEmailUseCaseRequest
{
  email: string;
	emailToken: string;
}

type VerifyEmailUseCaseResponse = Either<
	InvalidCredentialsError,
  object
>

@Injectable()
export class VerifyEmailUseCase
{
	constructor(
    private readonly userRepository: UserRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository
  )
  {}

	async execute({ email, emailToken }: VerifyEmailUseCaseRequest): Promise<VerifyEmailUseCaseResponse>
  {
		const user = await this.userRepository.findByEmail(email);

		if (!user)
    {
			return left(new InvalidCredentialsError('El correo eléctronico no es válido'));
		}

		if (user.emailStatus === EmailStatus.VERTIFIED)
    {
			return left(new InvalidCredentialsError('El usuario ya está verificado'));
		}

		const emailVerification = await this.emailVerificationRepository.findOne(emailToken, user.id.toString());

    if (!emailVerification)
    {
			return left(new InvalidCredentialsError('El código no es válido'));
		}

    const date = new DateFormat(emailVerification.dateCreated);

    if (emailVerification && !date.limitTime())
    {
      await this.emailVerificationRepository.delete(emailVerification);
			return left(new InvalidCredentialsError('El código ya expiro'));
		}

		await this.emailVerificationRepository.edit(emailVerification, user);

		return right({});
	}
}
