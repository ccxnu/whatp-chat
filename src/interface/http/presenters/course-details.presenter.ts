import { CourseDetails } from '@/domain/value-objects/course-details'

export class CourseDetailsPresenter
{
	static toHttp(details: CourseDetails)
  {
		return {
      id: details.courseId.toString(),
      name: details.name,
      description: details.description,
      price: details.price,
      duration: details.duration,
      category: details.category,
      level: details.level,
      modality: details.modality,
      startDate: details.startDate,
      tags: details.tags,
    }
	}
}
