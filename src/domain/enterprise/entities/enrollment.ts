import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

interface EnrollmentProps
{
  userId: UniqueEntityId;
  courseId: UniqueEntityId;
  hasAccess: boolean;
  isCompleted: boolean;
  dateCreated: Date;
  dateUpdated: Date;
}

export class Enrollment extends Entity<EnrollmentProps>
{
  get userId()
  {
    return this.props.userId;
  }

	set userId(userId: UniqueEntityId)
  {
		this.props.userId = userId;
	}

  get courseId()
  {
    return this.props.courseId;
  }

	set courseId(courseId: UniqueEntityId)
  {
		this.props.courseId = courseId;
	}

  get hasAccess()
  {
    return this.props.hasAccess;
  }

  set hasAccess(hasAccess: boolean)
  {
    this.props.hasAccess = hasAccess;
  }

  get isCompleted()
  {
    return this.props.isCompleted;
  }

  set isCompleted(isCompleted: boolean)
  {
    this.props.isCompleted = isCompleted;
  }

	get dateCreated()
  {
		return this.props.dateCreated;
	}

	get dateUpdated()
  {
		return this.props.dateUpdated;
	}

	updateEnrollment()
  {
		this.props.dateUpdated = new Date();
	}

	static create(
    props: Optional<EnrollmentProps, 'dateCreated' | 'dateUpdated'>,
    id?: UniqueEntityId
  )
  {
		const enrollment = new Enrollment(
      {
        ...props,
				dateCreated: props.dateCreated ?? new Date(),
				dateUpdated: props.dateUpdated ?? props.dateCreated ?? new Date(),
      },
      id
    );

		return enrollment;
	}
}
