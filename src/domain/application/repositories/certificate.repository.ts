import { PaginationParams } from '@/core/repositories/pagination-params';
import { Certificate } from '@/domain/entities/certificate';
import { CertificateDetails } from '@/domain/value-objects/certificate-details';

export type FindManyByFiltersParams = PaginationParams & {
  userId?: string;
  courseId?: string;
	isCompleted?: boolean;
}

export abstract class CertificateRepository
{
  abstract create(data: Certificate): Promise<void>;
	abstract edit(data: Certificate): Promise<void>;

  abstract findById(id: string): Promise<Certificate | null>;
  abstract findByCedula(id: string): Promise<CertificateDetails[] | null>;
  abstract findByIdWithDetails(id: string): Promise<CertificateDetails | null>;
  //abstract findByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | null>;
  //abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<EnrollmentDetails[]>>;
}

