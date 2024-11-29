import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common';

import { MinQuerySearchNotProviedError } from '@/application/errors/expected-one-search-param-error';
import { SearchByFilterEnrollmentUseCase } from '@/application/use-cases/enrollment/search-by-filter';
import { UserRoles } from '@/core/repositories/roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { ZodValidationBooleanPipe } from '@/interface/http/pipes/zod-validation-boolean.pipe';
import { ZodValidationPagePipe } from '@/interface/http/pipes/zod-validation-page.pipe';
import { ZodValidationPerPagePipe } from '@/interface/http/pipes/zod-validation-per-page.pipe';
import { EnrollmentDetailsPresenter } from '@/interface/http/presenters/enrollment-details.presenter';

@Controller('/enrollment/search-by-filter')
export class SearchByFilterEnrollmenteController
{
	constructor(private readonly searchByFilterUseCase: SearchByFilterEnrollmentUseCase)
  {}

	@Get()
	@HttpCode(200)
  @Roles(UserRoles.ADMINISTRATOR)
	async handle(
		@Query('userId') userId: string,
		@Query('courseId') courseId: string,
		@Query('hasAccess', ZodValidationBooleanPipe) hasAccess: boolean,
		@Query('isCompleted', ZodValidationBooleanPipe) isCompleted: boolean,
		@Query('page', ZodValidationPagePipe) page: number,
		@Query('perPage', ZodValidationPerPagePipe) perPage: number,
	)
  {
		const response = await this.searchByFilterUseCase.execute({
      isCompleted,
      userId,
      courseId,
      hasAccess,
			page,
			perPage,
		})

		if (response.isLeft())
    {
			const error = response.value;

			switch (error.constructor)
      {
				case MinQuerySearchNotProviedError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			data: response.value.data.map((item) =>
				EnrollmentDetailsPresenter.toHttp(item),
			),
			totalItems: response.value.totalItems,
			totalPages: response.value.totalPages,
			perPage: response.value.perPage,
		}
	}
}
