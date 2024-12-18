import { Module } from '@nestjs/common';

import { EmailVerificationRepository } from '@/application/repositories/email-verification.repository';
import { UserRepository } from '@/application/repositories/user.repository';
import { EnvModule } from '@/infra/env/env.module';

import { DatabaseProvider } from './kysely/kysely.provider';
import { KyselyEmailVerificationRepository } from './kysely/repositories/kysely-email-verification.repository';
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
      provide: EmailVerificationRepository,
      useClass: KyselyEmailVerificationRepository,
    },
  ],
  exports:
  [
    UserRepository,
    EmailVerificationRepository,
  ],
})
export class DatabaseModule
{}
