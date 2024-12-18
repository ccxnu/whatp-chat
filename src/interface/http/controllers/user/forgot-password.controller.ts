import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, HttpCode, Ip, UnauthorizedException } from '@nestjs/common';
import { tags } from 'typia';

import { ForgotPasswordUseCase } from '@/application/use-cases/user/forgot-password';
import { CreateResponse } from '@/core/entities/response';
import { Public } from '@/infra/auth/decorator/public.decorator';
import { UserAgent } from '@/infra/auth/decorator/user-agent.decorator';


interface ForgotPasswordDto
{
  email: string & tags.Format<'email'>;
}

@Public()
@Controller('/authenticate/forgot-password')
export class ForgotPasswordController
{
	constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase)
  {}

  /**
   * @summary 20241216 - Forgot user password
   *
   * @tag user
   * @param ForgotPasswordDto
   * @returns
   */
	@HttpCode(201)
  @TypedRoute.Post()
	async handle(
    @TypedBody() body: ForgotPasswordDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  )
  {
		const { email } = body;

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

    return CreateResponse({});
	}
}
