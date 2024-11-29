import { BadRequestException, Controller, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { DeleteUserUseCase } from '@/application/use-cases/user/delete';
import { ResponseProcess } from '@/core/entities/response';
import { UserRoles } from '@/core/repositories/roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';


@Controller('/user/:userId/delete-account')
export class DeleteUserAccountController
{
	constructor(private readonly deleteUseCase: DeleteUserUseCase)
  {}

	@Post()
	@HttpCode(200)
  @Roles(UserRoles.ADMINISTRATOR)
	async handle(@Param('userId', ParseUUIDPipe) userId: string)
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

    return new ResponseProcess();
	}
}
