import { Injectable } from '@nestjs/common';

import { CertificateRepository } from '@/application/repositories/certificate.repository';
import { EnrollmentRepository } from '@/application/repositories/enrollment.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Certificate } from '@/domain/entities/certificate';

interface EditEnrollmentUseCaseRequest
{
  enrollmentId: string;
  hasAccess?: boolean;
  isCompleted?: boolean;
}

type EditEnrollmentUseCaseResponse = Either<
  ResourceNotFoundError,
  object
>

@Injectable()
export class EditEnrollmentUseCase
{
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly certificateRepository: CertificateRepository,
  )
  {}

  async execute({ enrollmentId, hasAccess, isCompleted }: EditEnrollmentUseCaseRequest): Promise<EditEnrollmentUseCaseResponse>
  {

    const enrollment = await this.enrollmentRepository.findById(enrollmentId);

    if (!enrollment)
    {
			return left(new ResourceNotFoundError());
		}

    if (hasAccess !== undefined) enrollment.hasAccess = hasAccess;
    if (isCompleted !== undefined) enrollment.isCompleted = isCompleted;

    if(isCompleted === true)
    {
      const newCertificate = Certificate.create({ enrollmentId: enrollment.id });

      await this.certificateRepository.create(newCertificate);
    }

    await this.enrollmentRepository.edit(enrollment);

    return right({});
  }
}
