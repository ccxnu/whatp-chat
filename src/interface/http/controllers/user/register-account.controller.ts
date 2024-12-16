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
import { RegisterUserUseCase } from '@/application/use-cases/user/register';
import { CreateResponse } from '@/core/entities/response';
import { UserGenders } from '@/core/repositories/genders';
import { Public } from '@/infra/auth/decorator/public.decorator';
import { UserAgent } from '@/infra/auth/decorator/user-agent.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';


const schema = z.object({
	fullName: z.string(),
  dateOfBirth: z.coerce.date(),
  cedula: z.string().length(10),
	phone: z.string().min(10).max(15),
  gender: z.nativeEnum(UserGenders),
	email: z.string().email(),
  city: z.string().min(5).max(50),
	password: z.string().min(8).max(60),
})

type RegisterBodySchema = z.infer<typeof schema>
const bodyValidationPipe = new ZodValidationPipe(schema)

@Public()
@Controller('/authenticate/register')
export class RegisterUserAccountController
{
	constructor(private readonly registerUser: RegisterUserUseCase)
  {}

	@Post()
	@HttpCode(201)
	async handle(
    @Body(bodyValidationPipe) body: RegisterBodySchema,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  )
  {
		const response = await this.registerUser.execute({ ip, userAgent, ...body })

		if (response.isLeft())
    {
			const error = response.value;

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
