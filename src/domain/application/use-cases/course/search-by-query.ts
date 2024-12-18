import { Injectable } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { CourseRepository } from '@/application/repositories/course.repository';
import { Either, left, right } from '@/core/either';
import { CourseDetails } from '@/domain/value-objects/course-details';

interface SearchByQueryCourseRequest
{
	query: string;
	perPage: number;
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
    perPage
  }: SearchByQueryCourseRequest): Promise<SearchByQueryCourseResponse>
  {
		if (query && query.length < 2)
		  {
			return left(new InvalidQueryLengthError(2))
		}

		const courses = await this.courseRepository.findManyByQuery({
      query,
      perPage,
      page: 1,
		})

		return right({ courses })
	}
}
