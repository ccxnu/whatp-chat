import { Injectable } from '@nestjs/common';

import { AlreadyExistsError } from '@/application/errors/entity-already-exists-error';
import { CourseRepository } from '@/application/repositories/course.repository';
import { Either, left, right } from '@/core/either';
import { CourseLevel } from '@/core/repositories/course-level';
import { CourseModality } from '@/core/repositories/course-modalidad';
import { Course } from '@/domain/entities/course';

interface CreateCourseUseCaseRequest
{
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

type CreateCourseUseCaseResponse = Either<
  AlreadyExistsError,
  {
    course: Course;
  }
>

@Injectable()
export class CreateCourseUseCase
{
  constructor(private readonly courseRepository: CourseRepository)
  {}

  async execute(props: CreateCourseUseCaseRequest): Promise<CreateCourseUseCaseResponse>
  {
    const existedCourse = await this.courseRepository.findByName(props.name);

    if (existedCourse)
    {
			return left(new AlreadyExistsError());
    }

    const course = Course.create(props);

    await this.courseRepository.create(course);

    return right({ course });
  }
}
