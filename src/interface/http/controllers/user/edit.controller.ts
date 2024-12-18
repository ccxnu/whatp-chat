import { TypedBody, TypedRoute } from '@nestia/core';
import { BadRequestException, ConflictException, Controller, HttpCode } from '@nestjs/common';
import { tags } from 'typia';

import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';
import { EditUserUseCase } from '@/application/use-cases/user/edit';
import { CreateResponse } from '@/core/entities/response';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { UserGenders } from '@/domain/enums/user-gender';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';

interface EditUserDto
{
  phone: null | (string & tags.Pattern<"^[0-9]+$"> & tags.MinLength<10> & tags.MaxLength<13>);
  gender: null | UserGenders;
}

@Controller('/user/edit-account')
export class EditUserAccountController
{
	constructor(private editUseCase: EditUserUseCase)
  {}

  /**
   * @summary 20241216 - Edit user info
   *
   * @tag user
   * @param EditUserDto
   * @returns
   */
	@HttpCode(200)
  @TypedRoute.Post()
	async handle(@TypedBody() body: EditUserDto, @ActiveUser() user: IActiveUser)
  {
    const { sub } = user;
    const { phone, gender } = body;

    console.log(body)

		const result = await this.editUseCase.execute({
      userId: sub,
      phone,
      gender,
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
