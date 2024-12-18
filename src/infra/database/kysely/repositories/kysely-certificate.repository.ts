import { Injectable } from '@nestjs/common';

import { CertificateRepository } from '@/application/repositories/certificate.repository';
import { Certificate } from '@/domain/entities/certificate';
import { CertificateDetails } from '@/domain/value-objects/certificate-details';
import { Database } from '@/infra/database/kysely/database';

import { KyselyCertificateMapper } from '../mappers/kysely-certificate.mapper';
import { KyselyCertificateDetailsMapper } from '../mappers/kysely-certificate-details.mapper';

@Injectable()
export class KyselyCertificateRepository implements CertificateRepository
{
  constructor(private readonly database: Database)
  {}

  async create(data: Certificate): Promise<void>
  {
		const newCertificate = KyselyCertificateMapper.toKysely(data);

    await this.database
      .insertInto('certificate')
      .values({ ...newCertificate })
      .executeTakeFirst()
	}

	async edit(data: Certificate): Promise<void>
  {
		data.updateCertificate()

		const { id, ...result } = KyselyCertificateMapper.toKysely(data);

		await this.database
      .updateTable('certificate')
      .set({ ...result })
      .where('id', '=', id)
      .executeTakeFirst();
	}

  async findById(id: string): Promise<Certificate | null>
  {
    const certificate = await this.database
      .selectFrom('certificate')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    if (!certificate) return null;

    return KyselyCertificateMapper.toDomain(certificate);
  }

  async findByCedula(cedula: string): Promise<CertificateDetails[] | null>
  {
    const enrollment = await this.database
      .selectFrom('certificate')
      .innerJoin('enrollment', 'enrollment.id', 'certificate.enrollment_id')
      .innerJoin('users', 'users.id', 'enrollment.user_id')
      .innerJoin('course', 'course.id', 'enrollment.course_id')
      .where('users.cedula', '=', cedula)
      .select([
        "certificate.id",
        "users.full_name",
        "certificate.date_created",
        "course.name as course_name",
        "course.startDate as course_date_started",
        "course.duration as duration",
      ])
      .execute();

    if (!enrollment) return null;

		return enrollment.map((item) =>
    {
      return KyselyCertificateDetailsMapper.toDomain(item);
    })
  }

  async findByIdWithDetails(id: string): Promise<CertificateDetails | null>
  {
    const enrollment = await this.database
      .selectFrom('certificate')
      .innerJoin('enrollment', 'enrollment.id', 'certificate.enrollment_id')
      .innerJoin('users', 'users.id', 'enrollment.user_id')
      .innerJoin('course', 'course.id', 'enrollment.course_id')
      .where('certificate.id', '=', id)
      .select([
        "certificate.id",
        "users.full_name",
        "certificate.date_created",
        "course.name as course_name",
        "course.startDate as course_date_started",
        "course.duration as duration",
      ])
      .executeTakeFirst();

    if (!enrollment) return null;

    return KyselyCertificateDetailsMapper.toDomain(enrollment);
  }
}
