import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

interface CertificateProps
{
  enrollmentId: UniqueEntityId;
  numDownloads: number;
  dateCreated: Date;
  dateUpdated: Date;
}

export class Certificate extends Entity<CertificateProps>
{
  get enrollmentId()
  {
    return this.props.enrollmentId;
  }

  set enrollmentId(id: UniqueEntityId)
  {
    this.props.enrollmentId = id;
  }

  get numDownloads()
  {
    return this.props.numDownloads;
  }

  set numDownloads(id: number)
  {
    this.props.numDownloads = id;
  }

	get dateCreated()
  {
		return this.props.dateCreated;
	}

	get dateUpdated()
  {
		return this.props.dateUpdated;
	}

	updateCertificate()
  {
		this.props.dateUpdated = new Date();
	}

	static create(
    props: Optional<CertificateProps, 'numDownloads' | 'dateCreated' | 'dateUpdated'>,
    id?: UniqueEntityId
  )
  {
		const certificate = new Certificate(
      {
        ...props,
        numDownloads: 0,
				dateCreated: props.dateCreated ?? new Date(),
				dateUpdated: props.dateUpdated ?? props.dateCreated ?? new Date(),
      },
      id
    );

		return certificate;
	}
}
