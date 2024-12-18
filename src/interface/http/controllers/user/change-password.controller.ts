import { TypedBody, TypedRoute } from '@nestia/core';
import { BadRequestException, Controller, HttpCode } from '@nestjs/common'
import { tags } from 'typia';

import { ChangeUserPasswordUseCase } from '@/application/use-cases/user/change-password';
import { CreateResponse } from '@/core/entities/response';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';


interface ChangePasswordDto
{
  password: string & tags.Format<"password"> & tags.MinLength<8> & tags.MaxLength<60>;
}

@Controller('/user/change-password')
export class ChangeUserPasswordController
{
	constructor(private readonly changePasswordUseCase: ChangeUserPasswordUseCase)
  {}

  /**
   * @summary 20241216 - Change user password
   *
   * @tag user
   * @param ChangePasswordDto
   * @returns
   */
	@HttpCode(200)
  @TypedRoute.Post()
	async handle(@TypedBody() body: ChangePasswordDto, @ActiveUser() user: IActiveUser)
  {
    const { sub } = user;

		const result = await this.changePasswordUseCase.execute({
			userId: sub,
			password: body.password,
		});

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				default:
					throw new BadRequestException(error.message)
			}
		}

    return CreateResponse({});
	}
}
