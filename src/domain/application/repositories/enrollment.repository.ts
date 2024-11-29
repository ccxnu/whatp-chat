import { PaginationData } from '@/core/repositories/pagination-data';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { Enrollment } from '@/domain/entities/enrollment';
import { EnrollmentDetails } from '@/domain/value-objects/enrollment-details';

export type FindManyByFiltersParams = PaginationParams & {
  userId?: string;
  courseId?: string;
	hasAccess?: boolean;
	isCompleted?: boolean;
}

export abstract class EnrollmentRepository
{
  abstract create(data: Enrollment): Promise<void>;
	abstract edit(data: Enrollment): Promise<void>;

  abstract findById(id: string): Promise<Enrollment | null>;
  abstract findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null>;
  abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<EnrollmentDetails[]>>;
}

