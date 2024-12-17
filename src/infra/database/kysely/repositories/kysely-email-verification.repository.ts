import { Injectable } from '@nestjs/common';

import { EmailVerificationRepository } from '@/application/repositories/email-verification.repository';
import { EmailVerification } from '@/domain/entities/email-verification';
import { User } from '@/domain/entities/user';
import { EmailStatus } from '@/domain/enums/user-email-status';
import { Database } from '@/infra/database/kysely/database';

import { KyselyEmailVerificationMapper } from '../mappers/kysely-email-verification.mapper';

@Injectable()
export class KyselyEmailVerificationRepository implements EmailVerificationRepository
{
  constructor(private readonly database: Database)
  {}

  async create(data: EmailVerification): Promise<void>
  {
    const newEmailVerification = KyselyEmailVerificationMapper.toKysely(data);

    await this.database
      .insertInto('email_verification')
      .values({ ...newEmailVerification })
      .execute()
  }

  async findOne(emailToken: string, userId: string): Promise<EmailVerification | null>
  {
    const data = await this.database
      .selectFrom('email_verification')
      .selectAll()
      .where('email_token', '=', emailToken)
      .where('user_id', '=', userId)
      .where('date_deleted', 'is', null)
      .executeTakeFirst()

      if (!data) return null

      return KyselyEmailVerificationMapper.toDomain(data);
  }

  async findOnebyUserId(userId: string): Promise<EmailVerification | null>
  {
    const data = await this.database
      .selectFrom('email_verification')
      .selectAll()
      .where('user_id', '=', userId)
      .where('date_deleted', 'is', null)
      .executeTakeFirst()

      if (!data) return null

      return KyselyEmailVerificationMapper.toDomain(data);
  }

  async edit(data: EmailVerification, user: User): Promise<void>
  {
    user.updateUser();
    data.deleteEntity();

    await this.database.transaction()
      .execute(async (trx) =>
      {
        await trx
          .updateTable('email_verification')
          .set({ date_deleted: data.dateDeleted })
          .where('id', '=', data.id.toString())
          .executeTakeFirst()

        await trx
          .updateTable('user')
          .set({
            date_updated: user.dateUpdated,
            email_status: EmailStatus.VERTIFIED
          })
          .where('id', '=', user.id.toString())
          .executeTakeFirst();
    })
  }


  async delete(data: EmailVerification): Promise<void>
  {
    data.deleteEntity();

    await this.database
      .updateTable('email_verification')
      .set({ date_deleted: data.dateDeleted })
      .where('id', '=', data.id.toString())
      .executeTakeFirst()
  }
}
