import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CourseDetails } from '@/domain/value-objects/course-details'

import { CourseTable } from '../tables/course.table'

export class KyselyCourseDetailsMapper
{
	static toDomain(raw: CourseTable): CourseDetails
  {
		return CourseDetails.create(
			{
        courseId: new UniqueEntityId(raw.id),
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
			},
		)
	}

}
