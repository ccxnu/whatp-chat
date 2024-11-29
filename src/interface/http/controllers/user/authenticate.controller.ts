import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';

import { InvalidCredentialsError } from '@/application/errors/invalid-credentials-error';
import { AuthenticateUserUseCase } from '@/application/use-cases/user/authenticate';
import { ResponseProcess } from '@/core/entities/response';
import { Public } from '@/infra/auth/decorator/public.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';


const authenticateBodySchema = z.object({
	username: z.string(),
	password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>
const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

@Public()
@Controller('/authenticate/sign-in')
export class AuthenticateUserController
{
	constructor(private readonly authenticateUseCase: AuthenticateUserUseCase)
  {}

	@Post()
	@HttpCode(200)
	async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema)
  {
		const { username, password } = body

		const response = await this.authenticateUseCase.execute({
			username,
			password,
		})

		if (response.isLeft())
    {
			const error = response.value

			switch (error.constructor)
      {
				case InvalidCredentialsError:
					throw new UnauthorizedException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

    const { user } = response.value;

    return new ResponseProcess({ user });
	}
}
