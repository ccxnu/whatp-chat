import { Injectable } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { EnrollmentRepository } from '@/application/repositories/enrollment.repository';
import { Either, right } from '@/core/either';
import { PaginationData } from '@/core/repositories/pagination-data';
import { EnrollmentDetails } from '@/domain/value-objects/enrollment-details';

interface SearchByFilterEnrollmentRequest
{
  userId?: string;
  courseId?: string;
  hasAccess?: boolean;
  isCompleted?: boolean;
	page: number
	perPage: number
}

type SearchByFilterEnrollmentResponse = Either<
	InvalidQueryLengthError,
	PaginationData<EnrollmentDetails[]>
>

@Injectable()
export class SearchByFilterEnrollmentUseCase
{
	constructor(private readonly enrollmentRepository: EnrollmentRepository)
  {}

	async execute({
    userId,
    courseId,
    hasAccess,
    isCompleted,
    page,
    perPage,
  }: SearchByFilterEnrollmentRequest): Promise<SearchByFilterEnrollmentResponse>
  {
		const response = await this.enrollmentRepository.findManyByFilters({
      userId,
			courseId,
			hasAccess,
      isCompleted,
      page,
			perPage,
		})

		return right(response)
	}
}
