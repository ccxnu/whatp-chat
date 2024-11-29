import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Enrollment } from '@/domain/entities/enrollment';

import { EnrollmentTable } from '../tables/enrollment.table';

export class KyselyEnrollmentMapper
{
	static toDomain(raw: EnrollmentTable): Enrollment
  {
		return Enrollment.create(
			{
				userId: new UniqueEntityId(raw.user_id),
        courseId: new UniqueEntityId(raw.course_id),
        hasAccess: raw.has_access,
        isCompleted: raw.is_completed,
        dateCreated: raw.date_created,
        dateUpdated: raw.date_updated,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toKysely(data: Enrollment): EnrollmentTable
  {
		return {
      id: data.id.toString(),
      user_id: data.userId.toString(),
      course_id: data.courseId.toString(),
      has_access: data.hasAccess,
      is_completed: data.isCompleted,
      date_created: data.dateCreated,
      date_updated: data.dateUpdated,
		}
	}
}
