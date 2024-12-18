import { TypedBody, TypedRoute } from '@nestia/core';
import { BadRequestException, ConflictException, Controller, HttpCode, Ip } from '@nestjs/common';
import { tags } from 'typia';

import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';
import { RegisterAdminUseCase } from '@/application/use-cases/administrator/register';
import { CreateResponse } from '@/core/entities/response';
import { UserGenders } from '@/domain/enums/user-gender';
import { UserRoles } from '@/domain/enums/user-roles';
import { UserAgent } from '@/infra/auth/decorator/user-agent.decorator';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';

interface RegisterUserDto
{
  fullName: string;
  email: string & tags.Format<'email'>;
  cedula: string & tags.Pattern<'^[0-9]+$'> & tags.MinLength<10> & tags.MaxLength<10>;
  password: string & tags.Format<'password'> & tags.MinLength<8> & tags.MaxLength<60>;
  phone: string & tags.Pattern<"^[0-9]+$"> & tags.MinLength<10> & tags.MaxLength<13>;
  gender: UserGenders;
  role: UserRoles;
}

@Controller('/administrator/user/register-account')
export class RegisterAdminAccountController
{
	constructor(private readonly registerUseCase: RegisterAdminUseCase)
  {}

  /**
   * @summary 20241216 - Register user account
   *
   * @tag admin
   * @param RegisterUserDto
   * @returns
   */
  @Roles(UserRoles.ADMINISTRADOR)
	@HttpCode(201)
  @TypedRoute.Post()
	async handle(
    @TypedBody() body: RegisterUserDto,
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
