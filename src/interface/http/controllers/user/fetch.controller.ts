import { TypedQuery, TypedRoute } from '@nestia/core';
import { BadRequestException, Controller, HttpCode } from '@nestjs/common';

import { MinQuerySearchNotProviedError } from '@/application/errors/expected-one-search-param-error';
import { FindManyByFiltersParams } from '@/application/repositories/user.repository';
import { FetchUserUseCase } from '@/application/use-cases/user/fetch';
import { CreatePaginationResponse } from '@/core/entities/response';
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { UserDetailsPresenter } from '@/interface/http/presenters/user-details.presenter';

@Controller('/user/search-by-filter')
export class FetchUserAccountController
{
	constructor(private readonly fetchUseCase: FetchUserUseCase)
  {}

  /**
   * @summary 20241216 - Search users by filter
   *
   * @tag user
   * @param FindManyByFiltersParams
   * @returns The pagination value of the users list
   */
  @Roles(UserRoles.ADMINISTRADOR)
	@HttpCode(200)
  @TypedRoute.Get()
	async handle(@TypedQuery() paginationDto: FindManyByFiltersParams)
  {

		const result = await this.fetchUseCase.execute({
      ...paginationDto
    })

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				case MinQuerySearchNotProviedError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

    return CreatePaginationResponse({
      ...result.value,
      data: result.value.data.map((item) => UserDetailsPresenter.toHttp(item)),
    });

	}
}
