import { TypedBody, TypedRoute } from '@nestia/core';
import { BadRequestException, ConflictException, Controller, HttpCode } from '@nestjs/common';
import { tags } from 'typia';

import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';
import { EditAdminUseCase } from '@/application/use-cases/administrator/edit';
import { CreateResponse } from '@/core/entities/response';
import { UserGenders } from '@/domain/enums/user-gender';
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';

interface EditUserDto
{
  userId: string & tags.Format<'uuid'>;
  phone: null | (string & tags.Pattern<"^[0-9]+$"> & tags.MinLength<10> & tags.MaxLength<13>);
  gender: null | UserGenders;
  role: null | UserRoles;
}

@Controller('/administrator/user/edit-account')
export class EditAdminAccountController
{
	constructor(private editUseCase: EditAdminUseCase)
  {}

  /**
   * @summary 20241216 - Edit user info
   *
   * @tag admin
   * @param EditUserDto
   * @returns
   */
  @Roles(UserRoles.ADMINISTRADOR)
	@HttpCode(200)
  @TypedRoute.Post()
	async handle(@TypedBody() body: EditUserDto)
  {
		const {
      userId,
      phone,
      gender,
      role
    } = body;

		const result = await this.editUseCase.execute({
      userId,
      phone,
      gender,
      role
		});

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
