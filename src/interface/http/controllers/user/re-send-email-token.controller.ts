import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, HttpCode, Ip, UnauthorizedException } from '@nestjs/common';
import { tags } from 'typia';

import { SendEmailTokenUseCase } from '@/application/use-cases/user/send-email-token';
import { CreateResponse } from '@/core/entities/response';
import { Public } from '@/infra/auth/decorator/public.decorator';
import { UserAgent } from '@/infra/auth/decorator/user-agent.decorator';


interface SendEmailTokenDto
{
  email: string & tags.Format<'email'>;
}

@Public()
@Controller('/authenticate/re-send-email-token')
export class SendEmailTokenController
{
	constructor(private readonly sendEmailTokenUserCase: SendEmailTokenUseCase)
  {}

  /**
   * @summary 20241216 - Re-send email token
   *
   * @tag user
   * @param SendEmailTokenDto
   * @returns
   */
	@HttpCode(201)
  @TypedRoute.Post()
	async handle(
    @TypedBody() body: SendEmailTokenDto,
    @Ip() ip: string,
    @UserAgent() userAgent: string,
  )
  {
		const { email } = body;

		const response = await this.sendEmailTokenUserCase.execute({
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
