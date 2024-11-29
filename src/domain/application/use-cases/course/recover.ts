import { Injectable } from '@nestjs/common';

import { CourseRepository } from '@/application/repositories/course.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface RecoverCourseUseCaseRequest
{
  courseId: string;
}

type RecoverCourseUseCaseResponse = Either<
  ResourceNotFoundError,
  object
>

@Injectable()
export class RecoverCourseUseCase
{
	constructor(private courseRepository: CourseRepository)
  {}

	async execute({ courseId }: RecoverCourseUseCaseRequest):
    Promise<RecoverCourseUseCaseResponse>
  {

    const course = await this.courseRepository.findByIdOnDelete(courseId);

		if (!course)
    {
			return left(new ResourceNotFoundError());
		}

    await this.courseRepository.recover(course);

		return right({})
	}
}
