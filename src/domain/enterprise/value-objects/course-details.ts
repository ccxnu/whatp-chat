import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { CourseLevel } from '@/core/repositories/course-level';
import { CourseModality } from '@/core/repositories/course-modalidad';

export interface CourseDetailsProps
{
	courseId: UniqueEntityId;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  level: CourseLevel;
  modality: CourseModality;

  startDate: Date;
  isPopular: boolean;
  tags: string[];
}

export class CourseDetails extends ValueObject<CourseDetailsProps>
{
	get courseId()
  {
		return this.props.courseId;
	}

	get name()
  {
		return this.props.name;
	}

	get description()
  {
		return this.props.description;
	}

	get price()
  {
		return this.props.price;
	}

	get duration()
  {
		return this.props.duration;
	}

	get category()
  {
		return this.props.category;
	}

	get level()
  {
		return this.props.level;
	}

	get modality()
  {
		return this.props.modality;
	}

	get startDate()
  {
		return this.props.startDate;
	}

	get isPopular()
  {
		return this.props.isPopular;
	}

	get tags()
  {
		return this.props.tags;
	}

	static create(props: CourseDetailsProps)
  {
		return new CourseDetails(props);
	}

}
