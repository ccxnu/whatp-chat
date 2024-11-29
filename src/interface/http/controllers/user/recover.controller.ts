import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { RecoverUserUseCase } from '@/application/use-cases/user/recover';
import { ResponseProcess } from '@/core/entities/response';
import { UserRoles } from '@/core/repositories/roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';


@Controller('/user/:userId/recover')
export class RecoverUserAccountController
{
	constructor(private readonly recoverUseCase: RecoverUserUseCase)
  {}

	@Post()
	@HttpCode(200)
	@Roles(UserRoles.ADMINISTRATOR)
	async handle(@Param('userId', ParseUUIDPipe) id: string)
  {
		const result = await this.recoverUseCase.execute({
			userId: id,
		})

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
