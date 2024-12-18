import { TypedBody, TypedRoute } from '@nestia/core';
import { BadRequestException, Controller, HttpCode, UnauthorizedException } from '@nestjs/common';
import { tags } from 'typia';

import { InvalidCredentialsError } from '@/application/errors/invalid-credentials-error';
import { VerifyEmailUseCase } from '@/application/use-cases/user/verify-email';
import { CreateResponse } from '@/core/entities/response';
import { Public } from '@/infra/auth/decorator/public.decorator';

interface VerifyEmailTokenDto
{
  email: string & tags.Format<'email'>;
  emailToken: string;
}

@Public()
@Controller('/authenticate/verify-email-token')
export class VerifyEmailController
{
	constructor(private readonly verifyEmailUseCase: VerifyEmailUseCase)
  {}

  /**
   * @summary 20241216 - Verify email token
   *
   * @tag user
   * @param VerifyEmailTokenDto
   * @returns
   */
	@HttpCode(201)
  @TypedRoute.Post()
	async handle(@TypedBody() body: VerifyEmailTokenDto)
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

    return CreateResponse({});
	}
}
