import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { SearchUserUseCase } from '@/application/use-cases/user/search';
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { ZodValidationLimitPipe } from '@/interface/http/pipes/zod-validation-limit.pipe';
import { ZodValidationQueryPipe } from '@/interface/http/pipes/zod-validation-query.pipe';
import { UserDetailsPresenter } from '@/interface/http/presenters/user-details.presenter';


@Controller('/user/search')
export class SearchUserAccountController
{
	constructor(private searchUseCase: SearchUserUseCase)
  {}

	@Get()
	@HttpCode(200)
	@Roles(UserRoles.ADMINISTRADOR)
	async handle(
		@Query('query', ZodValidationQueryPipe) query: string,
		@Query('limit', ZodValidationLimitPipe) limit: number,
	)
  {
		const result = await this.searchUseCase.execute({
			query,
			limit,
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
