import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Ip,
	Post,
} from '@nestjs/common';
import { z } from 'zod';

import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';
import { RegisterAdminUseCase } from '@/application/use-cases/administrator/register';
import { CreateResponse } from '@/core/entities/response';
import { UserGenders } from '@/domain/enums/user-gender';
import { UserRoles } from '@/domain/enums/user-roles';
import { UserAgent } from '@/infra/auth/decorator/user-agent.decorator';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';

const createAccountBodySchema = z.object({
	fullName: z.string(),
	password: z.string().min(8).max(60),
	email: z.string().email(),
  cedula: z.string().length(10),
	phone: z.string(),
  gender: z.nativeEnum(UserGenders),
  role: z.nativeEnum(UserRoles),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)

@Controller('/administrator/user/register-account')
export class RegisterAdminAccountController
{
	constructor(private readonly registerUseCase: RegisterAdminUseCase)
  {}

	@Post()
	@HttpCode(201)
  @Roles(UserRoles.ADMINISTRADOR)
	async handle(
    @Body(bodyValidationPipe) body: CreateAccountBodySchema,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  )
  {
		const {
      fullName,
      password,
      email,
      cedula,
      phone,
      gender,
      role,
    } = body;

		const result = await this.registerUseCase.execute({
      fullName,
      password,
      email,
      cedula,
      phone,
      gender,
      role,
      ip,
      userAgent
		})

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				case UserAlreadyExistsError:
					throw new ConflictException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

    return CreateResponse({});
	}
}
