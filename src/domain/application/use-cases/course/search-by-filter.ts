import { Injectable } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { CourseRepository } from '@/application/repositories/course.repository';
import { Either, right } from '@/core/either';
import { CourseLevel } from '@/core/repositories/course-level';
import { CourseModality } from '@/core/repositories/course-modalidad';
import { PaginationData } from '@/core/repositories/pagination-data';
import { CourseDetails } from '@/domain/value-objects/course-details';

interface SearchByFilterCourseRequest
{
  category?: string;
  level?: CourseLevel;
  modality?: CourseModality;
  location?: string;
	page: number
	perPage: number
}

type SearchByFilterCourseResponse = Either<
	InvalidQueryLengthError,
	PaginationData<CourseDetails[]>
>

@Injectable()
export class SearchByFilterCourseUseCase
{
	constructor(private readonly courseRepository: CourseRepository)
  {}

	async execute({
    category,
    level,
    modality,
    page,
    perPage,
  }: SearchByFilterCourseRequest): Promise<SearchByFilterCourseResponse>
  {
		//if (category.length < 2)
		//  {
		//	return left(new InvalidQueryLengthError(2))
		//}

		const result = await this.courseRepository.findManyByFilters({
			category,
			level,
			modality,
      page,
			perPage,
		})

		return right(result)
	}
}
