import { Injectable } from '@nestjs/common';

import { HashGenerator } from '@/application/cryptography/hash-generator';
import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';
import { MailerRepository } from '@/application/mailer/mailer';
import { EmailVerificationRepository } from '@/application/repositories/email-verification.repository';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { RandomNumber } from '@/core/entities/random-number';
import { EmailStatus } from '@/core/repositories/email-status';
import { UserGenders } from '@/core/repositories/genders';
import { UserRoles } from '@/core/repositories/roles';
import { EmailVerification } from '@/domain/entities/email-verification';
import { User } from '@/domain/entities/user';


interface RegisterAdminUseCaseRequest
{
	fullName: string;
	password: string;
	email: string;
  cedula: string;
  phone: string;
	gender: UserGenders;
	dateOfBirth: Date;
  role: UserRoles;
  ip: string;
  userAgent: string;
}

type RegisterAdminUseCaseResponse = Either<
	UserAlreadyExistsError,
	{
		user: User;
	}
>

@Injectable()
export class RegisterAdminUseCase
{
	constructor(
		private readonly userRepository: UserRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
		private readonly hashGenerator: HashGenerator,
    private readonly mailerRepository: MailerRepository,
	)
  {}

	async execute({
		fullName,
    password,
		email,
		cedula,
		phone,
		gender,
		dateOfBirth,
    role,
    ip,
    userAgent
	}: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse>
  {
		const withSameCedula = await this.userRepository.findByUnique(cedula);

    if(withSameCedula)
    {
			return left(new UserAlreadyExistsError(`'${withSameCedula.cedula}''`))
    }

		const withSameEmail = await this.userRepository.findByUnique(email);

    if(withSameEmail)
    {
			return left(new UserAlreadyExistsError(`'${withSameEmail.email}'`));
    }

		const hashedPassword = await this.hashGenerator.hash(password);

		const user = User.create({
			fullName,
			password: hashedPassword,
			email,
			cedula,
			phone,
			gender,
      dateOfBirth,
			role,
      emailStatus: EmailStatus.NOT_VERIFIED,
		})

    const emailToken = new RandomNumber().toString();

    const emailVerification = EmailVerification.create({
      userId: user.id.toString(),
      emailToken,
    })


		await this.userRepository.create(user);

    await this.emailVerificationRepository.create(emailVerification);
    await this.mailerRepository.sendVerifyEmail(user, emailVerification, ip, userAgent);

		return right({ user })
	}
}
