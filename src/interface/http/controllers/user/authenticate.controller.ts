import { TypedBody, TypedRoute } from '@nestia/core';
import { BadRequestException, Controller, HttpCode, UnauthorizedException } from '@nestjs/common';

import { InvalidCredentialsError } from '@/application/errors/invalid-credentials-error';
import { AuthenticateUserUseCase, UseCaseRequest } from '@/application/use-cases/user/authenticate';
import { CreateResponse } from '@/core/entities/response';
import { Public } from '@/infra/auth/decorator/public.decorator';


@Public()
@Controller('/authenticate/sign-in')
export class AuthenticateUserController
{
	constructor(private readonly authenticateUseCase: AuthenticateUserUseCase)
  {}

  /**
   * @summary 20241216 - Login with email and password
   *
   * @tag auth
   * @param email string
   * @param password string
   * @returns An encrypted token, containing a value to decode and use.
   */
	@HttpCode(200)
  @TypedRoute.Post()
	async handle(@TypedBody() body: UseCaseRequest)
  {
		const response = await this.authenticateUseCase.execute(body);

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

    const { accessToken } = response.value;

    return CreateResponse({ accessToken });
	}
}
