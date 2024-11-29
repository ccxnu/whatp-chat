import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CertificateDetails } from '@/domain/value-objects/certificate-details';

export class KyselyCertificateDetailsMapper
{
	static toDomain(raw: any): CertificateDetails
  {
		return CertificateDetails.create(
			{
        certificateId: new UniqueEntityId(raw.id),
        userFullName: `${raw.first_names} ${raw.last_names}`,
        dateCompleted: raw.date_created,
        courseName: raw.course_name,
        courseDateStarted: raw.course_date_started,
        courseDuration: raw.course_duration,
			}
		)
	}
}
