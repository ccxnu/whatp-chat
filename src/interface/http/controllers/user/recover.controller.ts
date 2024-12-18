import { TypedParam, TypedRoute } from '@nestia/core';
import { BadRequestException, Controller, HttpCode } from '@nestjs/common';
import { tags } from 'typia';

import { RecoverUserUseCase } from '@/application/use-cases/user/recover';
import { CreateResponse } from '@/core/entities/response';
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';


@Controller('/user/:userId/recover')
export class RecoverUserAccountController
{
	constructor(private readonly recoverUseCase: RecoverUserUseCase)
  {}

	@Roles(UserRoles.ADMINISTRADOR)
	@HttpCode(200)
  @TypedRoute.Post()
	async handle(@TypedParam('userId') userId: string & tags.Format<'uuid'>)
  {
		const result = await this.recoverUseCase.execute({ userId })

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				default:
					throw new BadRequestException(error.message);
			}
		}

    return CreateResponse({});
	}
}
