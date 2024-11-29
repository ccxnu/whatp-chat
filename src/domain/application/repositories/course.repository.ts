import { CourseLevel } from '@/core/repositories/course-level';
import { CourseModality } from '@/core/repositories/course-modalidad';
import { PaginationData } from '@/core/repositories/pagination-data';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';
import { Course } from '@/domain/entities/course';
import { CourseDetails } from '@/domain/value-objects/course-details';

export type FindManyByFiltersParams = PaginationParams & {
  category?: string;
  level?: CourseLevel;
  modality?: CourseModality;
  location?: string;
	deleted?: boolean;
}

export abstract class CourseRepository
{
  abstract create(data: Course): Promise<void>;
	abstract edit(data: Course): Promise<void>;
	abstract delete(data: Course): Promise<void>;
	abstract recover(data: Course): Promise<void>;

  abstract findById(id: string): Promise<Course | null>;
  abstract findByName(name: string): Promise<Course | null>;
  abstract findByIdOnDelete(id: string): Promise<Course | null>;
  abstract findByIdWithDetails(id: string): Promise<CourseDetails | null>;
  abstract findManyByQuery(params: QueryDataLimitParams): Promise<CourseDetails[]>;
  abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<CourseDetails[]>>;
}

