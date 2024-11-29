import { Injectable } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { CourseRepository } from '@/application/repositories/course.repository';
import { Either, left, right } from '@/core/either';
import { CourseDetails } from '@/domain/value-objects/course-details';

interface SearchByQueryCourseRequest
{
	query: string;
	limit: number;
}

type SearchByQueryCourseResponse = Either<
	InvalidQueryLengthError,
	{
		courses: CourseDetails[];
	}
>

@Injectable()
export class SearchByQueryCourseUseCase
{
	constructor(private readonly courseRepository: CourseRepository)
  {}

	async execute({
    query,
    limit
  }: SearchByQueryCourseRequest): Promise<SearchByQueryCourseResponse>
  {
		if (query.length < 2)
		  {
			return left(new InvalidQueryLengthError(2))
		}

		const courses = await this.courseRepository.findManyByQuery({
      query,
      limit
		})

		return right({ courses })
	}
}
