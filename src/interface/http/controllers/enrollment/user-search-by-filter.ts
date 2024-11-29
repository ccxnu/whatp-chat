import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common';

import { MinQuerySearchNotProviedError } from '@/application/errors/expected-one-search-param-error';
import { SearchByFilterEnrollmentUseCase } from '@/application/use-cases/enrollment/search-by-filter';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';
import { ZodValidationBooleanPipe } from '@/interface/http/pipes/zod-validation-boolean.pipe';
import { ZodValidationPagePipe } from '@/interface/http/pipes/zod-validation-page.pipe';
import { ZodValidationPerPagePipe } from '@/interface/http/pipes/zod-validation-per-page.pipe';
import { CourseEnrollmentDetailsPresenter } from '@/interface/http/presenters/course-enrollment-details.presenter';

@Controller('/user/enrollment/search-by-filter')
export class FilterUserEnrollmenteController
{
	constructor(private readonly searchByFilterUseCase: SearchByFilterEnrollmentUseCase)
  {}

	@Get()
	@HttpCode(200)
	async handle(
		@Query('hasAccess', ZodValidationBooleanPipe) hasAccess: boolean,
		@Query('isCompleted', ZodValidationBooleanPipe) isCompleted: boolean,
		@Query('page', ZodValidationPagePipe) page: number,
		@Query('perPage', ZodValidationPerPagePipe) perPage: number,
    @ActiveUser() user: IActiveUser
	)
  {
		const response = await this.searchByFilterUseCase.execute({
      userId: user.sub,
      courseId: undefined,
      hasAccess,
      isCompleted,
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
				CourseEnrollmentDetailsPresenter.toHttp(item),
			),
			totalItems: response.value.totalItems,
			totalPages: response.value.totalPages,
			perPage: response.value.perPage,
		}
	}
}
