import { Injectable } from '@nestjs/common';

import { CourseRepository } from '@/application/repositories/course.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CourseLevel } from '@/core/repositories/course-level';
import { CourseModality } from '@/core/repositories/course-modalidad';

interface EditCourseUseCaseRequest
{
  courseId: string;
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  category?: string;
  level?: CourseLevel;
  modality?: CourseModality;
  startDate?: Date;
  isPopular?: boolean;
  tags?: string[];
}

type EditCourseUseCaseResponse = Either<
  ResourceNotFoundError,
  object
>

@Injectable()
export class EditCourseUseCase
{
  constructor(private readonly courseRepository: CourseRepository)
  {}

  async execute({
    courseId,
    name,
    description,
    price,
    duration,
    category,
    level,
    modality,
    startDate,
    isPopular,
    tags
  }: EditCourseUseCaseRequest): Promise<EditCourseUseCaseResponse>
  {
    const course = await this.courseRepository.findById(courseId);

		if (!course)
    {
			return left(new ResourceNotFoundError());
		}

    if (name) course.name = name;
    if (description) course.description = description;
    if (price) course.price = price;
    if (duration) course.duration = duration;
    if (category) course.category = category;
    if (level) course.level = level;
    if (modality) course.modality = modality;
    if (startDate) course.startDate = startDate;
    if (tags) course.tags = tags;
    if (isPopular !== undefined) course.isPopular = isPopular;

    await this.courseRepository.edit(course);

		return right({})
  }
}
