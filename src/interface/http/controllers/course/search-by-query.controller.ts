import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { SearchByQueryCourseUseCase } from '@/application/use-cases/course/search-by-query';
import { Public } from '@/infra/auth/decorator/public.decorator';
import { ZodValidationLimitPipe } from '@/interface/http/pipes/zod-validation-limit.pipe';
import { ZodValidationQueryPipe } from '@/interface/http/pipes/zod-validation-query.pipe';

import { CourseDetailsPresenter } from '../../presenters/course-details.presenter';

@Public()
@Controller('/course/search')
export class SearchByQueryCourseController
{
	constructor(private readonly searchByQueryUseCase: SearchByQueryCourseUseCase)
  {}

	@Get()
	@HttpCode(200)
	async handle(
		@Query('query', ZodValidationQueryPipe) query: string,
		@Query('limit', ZodValidationLimitPipe) limit: number,
	)
  {
		const result = await this.searchByQueryUseCase.execute({
      query,
      limit
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
			data: result.value.courses.map((item) =>
				CourseDetailsPresenter.toHttp(item),
			),
		}
	}
}
