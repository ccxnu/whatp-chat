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
import { VerifyEmailUseCase } from '@/application/use-cases/user/verify-email';
import { ResponseProcess } from '@/core/entities/response';
import { Public } from '@/infra/auth/decorator/public.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';


const authenticateBodySchema = z.object({
  email: z.string().email(),
	emailToken: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

@Public()
@Controller('/authenticate/verify-email-token')
export class VerifyEmailController
{
	constructor(private readonly verifyEmailUseCase: VerifyEmailUseCase)
  {}

	@Post()
	@HttpCode(201)
	async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema)
  {
		const { email, emailToken } = body

		const response = await this.verifyEmailUseCase.execute({
			email,
			emailToken,
		})

		if (response.isLeft())
    {
			const error = response.value;

			switch (error.constructor)
      {
				case InvalidCredentialsError:
					throw new UnauthorizedException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

    return new ResponseProcess();
	}
}
