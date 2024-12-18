import { TypedParam, TypedRoute } from '@nestia/core';
import { BadRequestException, Controller, HttpCode } from '@nestjs/common';
import { tags } from 'typia';

import { DeleteUserUseCase } from '@/application/use-cases/user/delete';
import { CreateResponse } from '@/core/entities/response';
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';


@Controller('/user/:userId/delete-account')
export class DeleteUserAccountController
{
	constructor(private readonly deleteUseCase: DeleteUserUseCase)
  {}

  /**
   * @summary 20241216 - Delete user account
   *
   * @tag user
   * @param userId uuid
   * @returns
   */
  @Roles(UserRoles.ADMINISTRADOR)
	@HttpCode(200)
  @TypedRoute.Post()
	async handle(@TypedParam('userId') userId: string & tags.Format<'uuid'>)
  {
		const result = await this.deleteUseCase.execute({
			userId,
		});

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
