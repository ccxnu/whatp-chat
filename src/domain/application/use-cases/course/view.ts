import { Injectable } from '@nestjs/common';

import { CourseRepository } from '@/application/repositories/course.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CourseDetails } from '@/domain/value-objects/course-details';

interface ViewCourseUseCaseRequest
{
	courseId: string
}

type ViewCourseUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		course: CourseDetails;
	}
>

@Injectable()
export class ViewCourseUseCase
{
	constructor(private courseRepository: CourseRepository)
  {}

	async execute({
		courseId,
	}: ViewCourseUseCaseRequest): Promise<ViewCourseUseCaseResponse>
  {
		const course = await this.courseRepository.findByIdWithDetails(courseId);

		if (!course)
    {
			return left(new ResourceNotFoundError());
		}

		return right({ course })
	}
}
