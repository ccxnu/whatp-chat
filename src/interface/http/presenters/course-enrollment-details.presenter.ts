import { EnrollmentDetails } from "@/domain/value-objects/enrollment-details";

export class CourseEnrollmentDetailsPresenter
{
	static toHttp(details: EnrollmentDetails)
  {
		return {
			id: details.enrollmentId.toString(),
      hasAccess: details.hasAccess,
      isCompleted: details.isCompleted,
      dateCreated: details.dateCreated,
      dateUpdated: details.dateUpdated,
      course: !details.course ? null : {
        courseId: details.course.courseId.toString(),
        name: details.course.name,
        category: details.course.category,
        modality: details.course.modality,
        duration: details.course.duration,
      }
		}
	}
}
