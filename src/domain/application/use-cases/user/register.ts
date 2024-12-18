import { Injectable } from '@nestjs/common';

import { AcademicokRepository } from '@/application/academicok/academicok';
import { HashGenerator } from '@/application/cryptography/hash-generator';
import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';
import { MailerRepository } from '@/application/mailer/mailer';
import { EmailVerificationRepository } from '@/application/repositories/email-verification.repository';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { RandomNumber } from '@/core/entities/random-number';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { EmailVerification } from '@/domain/entities/email-verification';
import { User } from '@/domain/entities/user';
import { EmailStatus } from '@/domain/enums/user-email-status';
import { UserGenders } from '@/domain/enums/user-gender';


interface RegisterUserUseCaseRequest
{
  cedula: string;
	password: string;
  phone: string;
	gender: UserGenders;
	dateOfBirth: string;
  city: string;
  ip: string;
  userAgent: string;
}

type RegisterUserUseCaseResponse = Either<
	UserAlreadyExistsError,
	{
		user: User;
	}
>

@Injectable()
export class RegisterUserUseCase
{
	constructor(
		private readonly userRepository: UserRepository,
		private readonly emailVerificationRepository: EmailVerificationRepository,
		private readonly hashGenerator: HashGenerator,
		private readonly mailerRepository: MailerRepository,
    private readonly academicokRepository: AcademicokRepository,
	)
  {}

	async execute({
    password,
		cedula,
		phone,
		gender,
		dateOfBirth,
    ip,
    userAgent,
	}: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse>
  {
    // TODO: endpoint para recuperar un usuario
		const withSameCedula = await this.userRepository.findByCedula(cedula);

    if(withSameCedula)
    {
			return left(new UserAlreadyExistsError(`'${withSameCedula.cedula}''`))
    }

    const academicokUser = await this.academicokRepository.fetchUserInfo(cedula);

    if (!academicokUser)
    {
      return left(new UnauthorizedError('No pertenece a la institución'));
    }

		const withSameEmail = await this.userRepository.findByEmail(academicokUser.email);

    if(withSameEmail)
    {
			return left(new UserAlreadyExistsError(`'${withSameEmail.email}'`));
    }

		const hashedPassword = await this.hashGenerator.hash(password);

		const user = User.create({
			fullName: academicokUser.fullName,
			password: hashedPassword,
			email: academicokUser.email,
			cedula: academicokUser.cedula,
			phone,
			gender,
      dateOfBirth: new Date(dateOfBirth),
			role: academicokUser.role,
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
