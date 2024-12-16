import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common';

import { ViewCourseUseCase } from '@/application/use-cases/course/view';
import { CreateResponse } from '@/core/entities/response';
import { Public } from '@/infra/auth/decorator/public.decorator';

import { CourseDetailsPresenter } from '../../presenters/course-details.presenter';

@Public()
@Controller('/course/:courseId/view')
export class ViewCourseController
{
	constructor(private viewUseCase: ViewCourseUseCase)
  {}

	@Get()
	@HttpCode(200)
	async handle(@Param('courseId', ParseUUIDPipe) id: string)
  {
		const result = await this.viewUseCase.execute({
			courseId: id,
		});

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				default:
					throw new BadRequestException(error.message);
			}
		}

		return CreateResponse(CourseDetailsPresenter.toHttp(result.value.course));
	}
}
