import { TypedBody, TypedRoute } from '@nestia/core';
import { BadRequestException, ConflictException, Controller, HttpCode, Ip } from '@nestjs/common';
import { tags } from 'typia';

import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';
import { RegisterUserUseCase } from '@/application/use-cases/user/register';
import { CreateResponse } from '@/core/entities/response';
import { UserGenders } from '@/domain/enums/user-gender';
import { Public } from '@/infra/auth/decorator/public.decorator';
import { UserAgent } from '@/infra/auth/decorator/user-agent.decorator';


interface RegisterUserDto
{
  cedula: string & tags.Pattern<"^[0-9]+$"> & tags.MinLength<10> & tags.MaxLength<10>;
  password: string & tags.Format<"password"> & tags.MinLength<8> & tags.MaxLength<60>;
  phone: string & tags.Pattern<"^[0-9]+$"> & tags.MinLength<10> & tags.MaxLength<13>;
  gender: UserGenders;
  dateOfBirth: string & tags.Format<"date">;
  city: string;
}

@Public()
@Controller('/authenticate/register')
export class RegisterUserAccountController
{
	constructor(private readonly registerUser: RegisterUserUseCase)
  {}

  /**
   * @summary 20241216 - Register user account
   *
   * @tag auth
   * @param RegisterUserDto
   * @returns
   */
	@HttpCode(201)
  @TypedRoute.Post()
	async handle(
    @TypedBody() body: RegisterUserDto,
    @UserAgent() userAgent: string,
    @Ip() ip: string
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
