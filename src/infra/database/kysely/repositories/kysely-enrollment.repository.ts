import { Injectable } from '@nestjs/common';

import { EnrollmentRepository, FindManyByFiltersParams } from '@/application/repositories/enrollment.repository';
import { PaginationData } from '@/core/repositories/pagination-data';
import { Enrollment } from '@/domain/entities/enrollment';
import { EnrollmentDetails } from '@/domain/value-objects/enrollment-details';
import { Database } from '@/infra/database/kysely/database';

import { KyselyEnrollmentMapper } from '../mappers/kysely-enrollment.mapper';
import { KyselyEnrollmentDetailsMapper } from '../mappers/kysely-enrollment-details.mapper';

@Injectable()
export class KyselyEnrollmentRepository implements EnrollmentRepository
{
  constructor(private readonly database: Database)
  {}

  async create(data: Enrollment): Promise<void>
  {
		const newEnrollment = KyselyEnrollmentMapper.toKysely(data);

    await this.database
      .insertInto('enrollment')
      .values({ ...newEnrollment })
      .executeTakeFirstOrThrow()
	}

	async edit(data: Enrollment): Promise<void>
  {
		data.updateEnrollment()

		const { id, ...result } = KyselyEnrollmentMapper.toKysely(data);

		await this.database
      .updateTable('enrollment')
      .set({ ...result })
      .where('id', '=', id)
      .executeTakeFirst();
	}

  async findById(id: string): Promise<Enrollment | null>
  {
    const enrollment = await this.database
      .selectFrom('enrollment')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    if (!enrollment) return null;

    return KyselyEnrollmentMapper.toDomain(enrollment);
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null>
  {
    const enrollment = await this.database
      .selectFrom('enrollment')
      .where('user_id', '=', userId)
      .where('course_id', '=', courseId)
      .selectAll()
      .executeTakeFirst();

    if (!enrollment) return null;

    return KyselyEnrollmentMapper.toDomain(enrollment);
  }

  async findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<EnrollmentDetails[]>>
  {
    const { userId, courseId, hasAccess, isCompleted, page, perPage } = props;

    const skip = (page - 1) * perPage;
    let totalCount: number = 0;

    let builder = this.database
      .selectFrom('enrollment')
      .innerJoin('user', 'user.id', 'enrollment.user_id')
      .innerJoin('course', 'course.id', 'enrollment.course_id')

    if (userId)
    {
      builder = builder.where('user_id', 'like', userId);
    }

    if (courseId)
    {
      builder = builder.where('course_id', '=', courseId);
    }

    if (hasAccess !== undefined)
    {
      builder = builder.where('has_access', '=', hasAccess);
    }

    if (isCompleted !== undefined)
    {
      builder = builder.where('is_completed', '=', isCompleted);
    }

    const count = await builder
      .select((op) => op.fn.countAll<number>().as("count"))
      .executeTakeFirst();

    if (!count)
    {
      totalCount = 0;
    }
    else
    {
      totalCount = count.count;
    }

    const result = await builder
      .limit(perPage)
      .offset(skip)
      .select([
        "enrollment.id",
        "enrollment.has_access",
        "enrollment.is_completed",
        "enrollment.date_created",
        "enrollment.date_updated",
        "user.id as user_id",
        "user.full_name",
        "user.cedula",
        "user.email",
        "course.id as course_id",
        "course.name",
        "course.category",
        "course.modality",
        "course.duration",
      ])
      .execute();

		return {
			data: result.map((item) =>
      {
				return KyselyEnrollmentDetailsMapper.toDomain(item);
			}),
			perPage,
			totalPages: Math.ceil(totalCount / perPage),
			totalItems: totalCount,
		}

  }

}
