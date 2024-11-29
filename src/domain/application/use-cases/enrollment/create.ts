import { Injectable } from '@nestjs/common';

import { AlreadyExistsError } from '@/application/errors/entity-already-exists-error';
import { CourseRepository } from '@/application/repositories/course.repository';
import { EnrollmentRepository } from '@/application/repositories/enrollment.repository';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { Enrollment } from '@/domain/entities/enrollment';
import { JobPosition } from '@/domain/enums/job-position';

interface EnrollmentUseCaseRequest
{
  userId: string;
  courseId: string;
}

type EnrollmentUseCaseResponse = Either<
  AlreadyExistsError | ResourceNotFoundError | UnauthorizedError,
  {
    enrollment: Enrollment;
  }
>

@Injectable()
export class CreateEnrollmentUseCase
{
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly courseRepository: CourseRepository,
    private readonly userRepository: UserRepository,
  )
  {}

  async execute({ userId, courseId }: EnrollmentUseCaseRequest): Promise<EnrollmentUseCaseResponse>
  {
		const user = await this.userRepository.findById(userId);

		if (!user)
    {
			return left(new ResourceNotFoundError());
		}

    if (
      user.city === null ||
      user.hasDisability === null ||
      user.educationLevel === null ||
      user.participationInCooperative === null ||
      JobPosition === null
    )
    {
			return left(new UnauthorizedError('Debe completar su información adicional'));
    }

    if (user.facturationId === null)
    {
			return left(new UnauthorizedError('Debe completar su información de facturación'));
    }

    const course = await this.courseRepository.findById(courseId);

    if (!course)
    {
			return left(new ResourceNotFoundError());
    }

    const enrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);

    if (enrollment)
    {
			return left(new AlreadyExistsError());
    }

    const domainUserId = new UniqueEntityId(userId);
    const domainCourseId = new UniqueEntityId(courseId);

    const newEnrollment = Enrollment.create({
      userId: domainUserId,
      courseId: domainCourseId,
      hasAccess: false,
      isCompleted: false,
    });

    await this.enrollmentRepository.create(newEnrollment);

    return right({ enrollment });
  }
}
