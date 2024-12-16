import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';

import { CourseRepository, FindManyByFiltersParams } from '@/application/repositories/course.repository';
import { PaginationData } from '@/core/repositories/pagination-data';
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';
import { Course } from '@/domain/entities/course';
import { CourseDetails } from '@/domain/value-objects/course-details';
import { Database } from '@/infra/database/kysely/database';

import { KyselyCourseMapper } from '../mappers/kysely-course.mapper';
import { KyselyCourseDetailsMapper } from '../mappers/kysely-course-details';

@Injectable()
export class KyselyCourseRepository implements CourseRepository
{
  constructor(private readonly database: Database)
  {}

  async create(data: Course): Promise<void>
  {
    const course = KyselyCourseMapper.toKysely(data);

    await this.database
      .insertInto('course')
      .values({
        ...course,
        tags: sql`JSON_ARRAY(${course.tags})`,
      })
      .executeTakeFirst()
  }

	async edit(data: Course): Promise<void>
  {
    data.updateCourse();

    const { id, ...result } = KyselyCourseMapper.toKysely(data);

    await this.database
      .updateTable('course')
      .set({
        ...result,
        tags: sql`JSON_ARRAY(${result.tags})`,
      })
      .where('id', '=', id)
      .executeTakeFirst()

  }

	async delete(data: Course): Promise<void>
  {
    data.deleteCourse();

		const { id, date_deleted } = KyselyCourseMapper.toKysely(data);

		await this.database
      .updateTable('course')
      .set({ date_deleted })
      .where('id', '=', id)
      .executeTakeFirst();
  }

	async recover(data: Course): Promise<void>
  {
    data.recoverCourse();

		const { id, date_deleted } = KyselyCourseMapper.toKysely(data);

		await this.database
      .updateTable('course')
      .set({ date_deleted })
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async findById(id: string): Promise<Course | null>
  {
    const course = await this.database
      .selectFrom('course')
      .where('id', '=', id)
      .where('date_deleted', 'is', null)
      .selectAll()
      .executeTakeFirst();

    if (!course) return null;

    return KyselyCourseMapper.toDomain(course);
  }

  async findByName(name: string): Promise<Course | null>
  {
    const course = await this.database
      .selectFrom('course')
      .where('name', '=', name)
      .where('date_deleted', 'is', null)
      .selectAll()
      .executeTakeFirst();

    if (!course) return null;

    return KyselyCourseMapper.toDomain(course);
  }

  async findByIdOnDelete(id: string): Promise<Course | null>
  {
    const course = await this.database
      .selectFrom('course')
      .where('id', '=', id)
      .where('date_deleted', 'is not', null)
      .selectAll()
      .executeTakeFirst();

    if (!course) return null;

    return KyselyCourseMapper.toDomain(course);
  }

  async findByIdWithDetails(id: string): Promise<CourseDetails | null>
  {
    const course = await this.database
      .selectFrom('course')
      .where('id', '=', id)
      .where('date_deleted', 'is', null)
      .selectAll()
      .executeTakeFirst();

    if (!course) return null;

    return KyselyCourseDetailsMapper.toDomain(course);
  }

  async findManyByQuery(params: QueryDataLimitParams): Promise<CourseDetails[]>
  {
    const { query, limit } = params;

    const courses = await this.database
      .selectFrom('course')
      .selectAll()
      .select(sql`MATCH(name, description) AGAINST (${query} IN NATURAL LANGUAGE MODE)`.as('relevance'))
      .where('date_deleted', 'is', null)
      .orderBy('relevance', 'desc')
      .limit(limit)
      .execute();

		return courses.map((item) =>
    {
      return KyselyCourseDetailsMapper.toDomain(item);
    })
  }

  async findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<CourseDetails[]>>
  {
    const { category, level, modality, location, page, perPage } = props;

    const skip = (page - 1) * perPage;

    let builder = this.database
      .selectFrom('course')
      .where('date_deleted', 'is', null)
      //.where('date_deleted', deleted ? 'is not' : 'is', null)

    if (category)
    {
      builder = builder.where('category', 'like', category)
    }

    if (level)
    {
      builder = builder.where('level', 'like', level);
    }

    if (modality)
    {
      builder = builder.where('modality', 'like', modality);
    }

    if (location)
    {
      builder = builder.where('location', 'like', location);
    }

    const { countCourses }: any = await builder
      .select((op) => op.fn.countAll<number>().as("countCourses"))
      .executeTakeFirst();

    const courses = await builder
      .limit(perPage)
      .offset(skip)
      .selectAll()
      .execute();

		return {
			data: courses.map((item) =>
      {
				return KyselyCourseDetailsMapper.toDomain(item);
			}),
			perPage,
			totalPages: Math.ceil(countCourses / perPage),
			totalItems: countCourses,
		}
  }
}
