import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { EnrollmentDetails } from '@/domain/value-objects/enrollment-details';

export class KyselyEnrollmentDetailsMapper
{
	static toDomain(raw: any): EnrollmentDetails
  {

		const user = !raw.user_id ? null : {
      userId: new UniqueEntityId(raw.user_id),
      firstNames: raw.first_names,
      lastNames: raw.last_names,
      cedula: raw.cedula,
      email: raw.email,
		}

		const course = !raw.course_id ? null : {
			courseId: new UniqueEntityId(raw.course_id),
			name: raw.name,
			category: raw.category,
			modality: raw.modality,
			duration: raw.duration,
		}

		return EnrollmentDetails.create(
			{
        enrollmentId: new UniqueEntityId(raw.id),
        hasAccess: raw.has_access,
        isCompleted: raw.is_completed,
        dateCreated: raw.date_created,
        dateUpdated: raw.date_updated,
        user,
        course,
			}
		)
	}
}
