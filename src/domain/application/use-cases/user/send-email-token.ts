import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/application/errors/invalid-credentials-error';
import { MailerRepository } from '@/application/mailer/mailer';
import { EmailVerificationRepository } from '@/application/repositories/email-verification.repository';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { DateFormat } from '@/core/entities/date';
import { RandomNumber } from '@/core/entities/random-number';
import { EmailStatus } from '@/core/repositories/email-status';
import { EmailVerification } from '@/domain/entities/email-verification';

interface VerifyEmailUseCaseRequest
{
  email: string;
  ip: string;
  userAgent: string;
}

type VerifyEmailUseCaseResponse = Either<
	InvalidCredentialsError,
  object
>

@Injectable()
export class SendEmailTokenUseCase
{
	constructor(
    private readonly userRepository: UserRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
		private readonly mailerRepository: MailerRepository,
  )
  {}

	async execute({ email, ip, userAgent }: VerifyEmailUseCaseRequest): Promise<VerifyEmailUseCaseResponse>
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

		const emailVerification = await this.emailVerificationRepository.findOnebyUserId(user.id.toString());

    if (emailVerification)
    {
      const date = new DateFormat(emailVerification.dateCreated);

      if (emailVerification && date.limitTime())
      {
        return left(new InvalidCredentialsError('Un código se ha enviado recientemente'));
      }

      await this.emailVerificationRepository.delete(emailVerification);
    }

    const emailToken = new RandomNumber().toString();

    const newEmailVerification = EmailVerification.create({
      userId: user.id.toString(),
      emailToken,
    })

    await this.emailVerificationRepository.create(newEmailVerification);

    await this.mailerRepository.sendVerifyEmail(user, newEmailVerification, ip, userAgent);

		return right({});
	}
}
