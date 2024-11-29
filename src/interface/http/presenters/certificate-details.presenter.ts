import { CertificateDetails } from '@/domain/value-objects/certificate-details'

export class CertificateDetailsPresenter
{
	static toHttp(details: CertificateDetails)
  {
		return {
      id: details.certificateId.toString(),
      name: details.userFullName,
      course: details.courseName,
      dateStarted: details.courseDateStarted,
      dateCompleted: details.dateCompleted,
      duration: details.courseDuration,
    }
	}
}
