import { Injectable } from '@nestjs/common';

import { CourseRepository } from '@/application/repositories/course.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface DeleteCourseUseCaseRequest
{
  courseId: string;
}

type DeleteCourseUseCaseResponse = Either<
  ResourceNotFoundError,
  object
>

@Injectable()
export class DeleteCourseUseCase
{
	constructor(private courseRepository: CourseRepository)
  {}

	async execute({ courseId }: DeleteCourseUseCaseRequest):
    Promise<DeleteCourseUseCaseResponse>
  {

    const course = await this.courseRepository.findById(courseId);

		if (!course)
    {
			return left(new ResourceNotFoundError());
		}

    await this.courseRepository.delete(course);

		return right({})
	}
}
