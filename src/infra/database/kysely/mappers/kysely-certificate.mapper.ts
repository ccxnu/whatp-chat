import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Certificate } from '@/domain/entities/certificate';

import { CertificateTable } from '../tables/certificate.table';

export class KyselyCertificateMapper
{
	static toDomain(raw: CertificateTable): Certificate
  {
		return Certificate.create(
			{
        enrollmentId: new UniqueEntityId(raw.enrollment_id),
        numDownloads: raw.num_downloads,
        dateCreated: raw.date_created,
        dateUpdated: raw.date_updated,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toKysely(data: Certificate): CertificateTable
  {
		return {
      id: data.id.toString(),
      enrollment_id: data.enrollmentId.toString(),
      num_downloads: data.numDownloads,
      date_created: data.dateCreated,
      date_updated: data.dateUpdated,
		}
	}
}
