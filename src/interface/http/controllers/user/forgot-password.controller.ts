import {
	Body,
	Controller,
	HttpCode,
	Ip,
	Post,
	UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';

import { ForgotPasswordUseCase } from '@/application/use-cases/user/forgot-password';
import { ResponseProcess } from '@/core/entities/response';
import { Public } from '@/infra/auth/decorator/public.decorator';
import { UserAgent } from '@/infra/auth/decorator/user-agent.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';


const authenticateBodySchema = z.object({
  email: z.string().email(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

@Public()
@Controller('/authenticate/forgot-password')
export class ForgotPasswordController
{
	constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase)
  {}

	@Post()
	@HttpCode(201)
	async handle(
    @Body(bodyValidationPipe) body: AuthenticateBodySchema,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  )
  {
		const { email } = body

		const response = await this.forgotPasswordUseCase.execute({
      email,
      ip,
      userAgent,
    })

		if (response.isLeft())
    {
			const error = response.value;

			switch (error.constructor)
      {
				default:
					throw new UnauthorizedException(error.message);
			}
		}

    return new ResponseProcess();
	}
}
