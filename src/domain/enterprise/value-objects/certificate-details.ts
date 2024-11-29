import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface CertificateDetailsProps
{
	certificateId: UniqueEntityId;
  userFullName: string;
  dateCompleted: Date;
  courseName: string;
  courseDateStarted: Date;
  courseDuration: number;
}

export class CertificateDetails extends ValueObject<CertificateDetailsProps>
{
	get certificateId()
  {
		return this.props.certificateId;
	}

	get userFullName()
  {
		return this.props.userFullName;
	}

	get dateCompleted()
  {
		return this.props.dateCompleted;
	}

	get courseName()
  {
		return this.props.courseName;
	}

	get courseDateStarted()
  {
		return this.props.courseDateStarted;
	}

	get courseDuration()
  {
		return this.props.courseDuration;
	}

	static create(props: CertificateDetailsProps)
  {
		return new CertificateDetails(props);
	}
}
