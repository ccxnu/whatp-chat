import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Course } from '@/domain/entities/course'

import { CourseTable } from '../tables/course.table'

export class KyselyCourseMapper
{
	static toDomain(raw: CourseTable): Course
  {
		return Course.create(
			{
        name: raw.name,
        description: raw.description,
				price: raw.price,
				duration: raw.duration,
				category: raw.category,
				level: raw.level,
        modality: raw.modality,
        startDate: raw.startDate,
        isPopular: raw.isPopular,
        tags: raw.tags,
        dateCreated: raw.date_created,
        dateUpdated: raw.date_updated,
        dateDeleted: raw.date_deleted,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toKysely(course: Course): CourseTable
  {
		return {
      id: course.id.toString(),
      name: course.name,
      description: course.description,
      price: course.price,
      duration: course.duration,
      category: course.category,
      level: course.level,
      modality: course.modality,
      startDate: course.startDate,
      isPopular: course.isPopular,
      tags: course.tags,
      date_created: course.dateCreated,
      date_updated: course.dateUpdated,
      date_deleted: course.dateDeleted,
		}
	}
}
