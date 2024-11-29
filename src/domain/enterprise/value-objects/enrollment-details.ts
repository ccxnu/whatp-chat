import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { CourseModality } from '@/core/repositories/course-modalidad';

export interface EnrollmentDetailsProps
{
	enrollmentId: UniqueEntityId;
  hasAccess: boolean;
  isCompleted: boolean;
  dateCreated: Date;
  dateUpdated: Date;
	user: {
		userId: UniqueEntityId;
    firstNames: string;
    lastNames: string;
    cedula: string;
    email: string;
	};
	course: {
		courseId: UniqueEntityId;
    name: string;
    category: string;
    modality: CourseModality;
    duration: number;
	}
}

export class EnrollmentDetails extends ValueObject<EnrollmentDetailsProps>
{
	get enrollmentId()
  {
		return this.props.enrollmentId;
	}

	get hasAccess()
  {
		return this.props.hasAccess;
	}

	get isCompleted()
  {
		return this.props.isCompleted;
	}

	get dateCreated()
  {
		return this.props.dateCreated;
	}

	get dateUpdated()
  {
		return this.props.dateUpdated;
	}

	get user()
  {
		return this.props.user;
	}

	get course()
  {
		return this.props.course;
	}

	static create(props: EnrollmentDetailsProps)
  {
		return new EnrollmentDetails(props);
	}
}
