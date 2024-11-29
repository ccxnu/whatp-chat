import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common';

import { MinQuerySearchNotProviedError } from '@/application/errors/expected-one-search-param-error';
import { SearchByFilterCourseUseCase } from '@/application/use-cases/course/search-by-filter';
import { CourseLevel } from '@/core/repositories/course-level';
import { CourseModality } from '@/core/repositories/course-modalidad';
import { Public } from '@/infra/auth/decorator/public.decorator';
import { ZodValidationEnumPipe } from '@/interface/http/pipes/zod-validation-enum.pipe';
import { ZodValidationPagePipe } from '@/interface/http/pipes/zod-validation-page.pipe';
import { ZodValidationPerPagePipe } from '@/interface/http/pipes/zod-validation-per-page.pipe';
import { CourseDetailsPresenter } from '@/interface/http/presenters/course-details.presenter';

@Public()
@Controller('/course/search-by-filter')
export class SearchByFilterCourseController
{
	constructor(private readonly searchByFilterUseCase: SearchByFilterCourseUseCase)
  {}

	@Get()
	@HttpCode(200)
	async handle(
		@Query('category') category: string,
    @Query('level', new ZodValidationEnumPipe(CourseLevel)) level: CourseLevel,
    @Query('modality', new ZodValidationEnumPipe(CourseModality)) modality: CourseModality,
		@Query('page', ZodValidationPagePipe) page: number,
		@Query('perPage', ZodValidationPerPagePipe) perPage: number,
	)
  {
		const result = await this.searchByFilterUseCase.execute({
      category,
      level,
      modality,
			page,
			perPage,
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

		return {
			data: result.value.data.map((item) =>
				CourseDetailsPresenter.toHttp(item),
			),
			totalItems: result.value.totalItems,
			totalPages: result.value.totalPages,
			perPage: result.value.perPage,
		}
	}
}
