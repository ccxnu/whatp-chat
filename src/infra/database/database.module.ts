import { Module } from '@nestjs/common';

import { CertificateRepository } from '@/application/repositories/certificate.repository';
import { CourseRepository } from '@/application/repositories/course.repository';
import { EmailVerificationRepository } from '@/application/repositories/email-verification.repository';
import { EnrollmentRepository } from '@/application/repositories/enrollment.repository';
import { FacturationRepository } from '@/application/repositories/facturation.repository';
import { UserRepository } from '@/application/repositories/user.repository';
import { EnvModule } from '@/infra/env/env.module';

import { DatabaseProvider } from './kysely/kysely.provider';
import { KyselyCertificateRepository } from './kysely/repositories/kysely-certificate.repository';
import { KyselyCourseRepository } from './kysely/repositories/kysely-course.repository';
import { KyselyEmailVerificationRepository } from './kysely/repositories/kysely-email-verification.repository';
import { KyselyEnrollmentRepository } from './kysely/repositories/kysely-enrollment.repository';
import { KyselyFacturationRepository } from './kysely/repositories/kysely-facturation.repository';
import { KyselyUserRepository } from './kysely/repositories/kysely-user.repository';

@Module({
  imports: [EnvModule],
  providers: [
    DatabaseProvider,
		{
			provide: UserRepository,
			useClass: KyselyUserRepository,
		},
		{
			provide: CourseRepository,
			useClass: KyselyCourseRepository,
		},
    {
      provide: EmailVerificationRepository,
      useClass: KyselyEmailVerificationRepository,
    },
    {
      provide: EnrollmentRepository,
      useClass: KyselyEnrollmentRepository,
    },
    {
      provide: CertificateRepository,
      useClass: KyselyCertificateRepository,
    },
    {
      provide: FacturationRepository,
      useClass: KyselyFacturationRepository,
    }
  ],
  exports:
  [
    UserRepository,
    CourseRepository,
    EmailVerificationRepository,
    EnrollmentRepository,
    CertificateRepository,
    FacturationRepository,
  ],
})
export class DatabaseModule
{}
