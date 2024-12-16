import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseLevel } from '@/core/repositories/course-level';
import { CourseModality } from '@/core/repositories/course-modalidad';
import { Optional } from '@/core/types/optional';

export interface CourseProps
{
  name: string;
  description: string;
  price: number;
  duration: number; // En horas
  category: string; // Ej: "Programación", "Marketing", "Música", etc.
  level: CourseLevel;

  modality: CourseModality;

  //locationId?: UniqueEntityId | null;

  startDate: Date; // Fecha de inicio
  isPopular: boolean | null;
  tags: string[] | null; // Etiquetas asociadas al curso, ej. ["JavaScript", "Frontend"]

  dateCreated: Date;
  dateUpdated: Date;
	dateDeleted?: Date | null;
}

export class Course extends Entity<CourseProps>
{
	get name()
  {
		return this.props.name;
	}

	set name(name: string)
  {
		this.props.name = name;
	}

	get description()
  {
		return this.props.description;
	}

	set description(description: string)
  {
		this.props.description = description;
	}

	get price()
  {
		return this.props.price;
	}

	set price(price: number)
  {
		this.props.price = price;
	}

  get duration()
  {
    return this.props.duration;
  }

  set duration(duration: number)
  {
    this.props.duration = duration;
  }

  get category()
  {
    return this.props.category;
  }

  set category(category: string)
  {
    this.props.category = category;
  }

  get level()
  {
    return this.props.level;
  }

  set level(level: CourseLevel)
  {
    this.props.level = level;
  }

  get modality()
  {
    return this.props.modality;
  }

  set modality(modality: CourseModality)
  {
    this.props.modality = modality;
  }

	get startDate()
  {
		return this.props.startDate;
	}

	set startDate(startDate: Date)
  {
		this.props.startDate = startDate;
	}

	get isPopular()
  {
		return this.props.isPopular;
	}

	set isPopular(isPopular: boolean | null)
  {
		this.props.isPopular = isPopular;
	}

  get tags()
  {
    return this.props.tags;
  }

  set tags(tags: string[] | null)
  {
    this.props.tags = tags;
  }

	get dateCreated()
  {
		return this.props.dateCreated;
	}

	get dateUpdated()
  {
		return this.props.dateUpdated;
	}

	updateCourse()
  {
		this.props.dateUpdated = new Date();
	}

	get dateDeleted()
  {
		return this.props.dateDeleted;
	}

	deleteCourse()
  {
		this.props.dateDeleted = new Date();
	}

	recoverCourse()
  {
		this.props.dateDeleted = null
	}

	static create(
    props: Optional<CourseProps, 'dateCreated' | 'dateUpdated'>,
    id?: UniqueEntityId
  )
  {
		const course = new Course(
      {
        ...props,
				dateCreated: props.dateCreated ?? new Date(),
				dateUpdated: props.dateUpdated ?? props.dateCreated ?? new Date(),
      },
      id
    );

		return course;
	}
}
