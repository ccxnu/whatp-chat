import { EnrollmentDetails } from "@/domain/value-objects/enrollment-details";

export class EnrollmentDetailsPresenter
{
	static toHttp(details: EnrollmentDetails)
  {
		return {
			id: details.enrollmentId.toString(),
      hasAccess: details.hasAccess,
      isCompleted: details.isCompleted,
      dateCreated: details.dateCreated,
      dateUpdated: details.dateUpdated,
      user: !details.user ? null : {
        userId: details.user.userId.toString(),
        firstNames: details.user.firstNames,
        lastNames: details.user.lastNames,
        cedula: details.user.cedula,
        email: details.user.email,
      },
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
