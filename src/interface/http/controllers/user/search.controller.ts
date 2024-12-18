import { TypedQuery, TypedRoute } from '@nestia/core';
import { BadRequestException, Controller, HttpCode } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { SearchUserUseCase } from '@/application/use-cases/user/search';
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { UserDetailsPresenter } from '@/interface/http/presenters/user-details.presenter';


@Controller('/user/search')
export class SearchUserAccountController
{
	constructor(private searchUseCase: SearchUserUseCase)
  {}

	@Roles(UserRoles.ADMINISTRADOR)
	@HttpCode(200)
  @TypedRoute.Get()
	async handle(@TypedQuery() searchDto: QueryDataLimitParams)
  {

    const { query, perPage, page } = searchDto;

		const result = await this.searchUseCase.execute({
			query,
			perPage,
      page,
		})

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				case InvalidQueryLengthError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			data: result.value.users.map((item) =>
				UserDetailsPresenter.toHttp(item),
			),
		}
	}
}
