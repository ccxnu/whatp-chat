import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { EmailVerification } from "@/domain/entities/email-verification";

import { EmailVerificationTable } from "../tables/email-verification.table";

export class KyselyEmailVerificationMapper
{
  static toDomain(raw: EmailVerificationTable): EmailVerification
  {
    return EmailVerification.create(
      {
        userId: raw.user_id,
        emailToken: raw.email_token,
        dateCreated: raw.date_created,
        dateDeleted: raw.date_deleted,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toKysely(data: EmailVerification): EmailVerificationTable
  {
    return {
      id: data.id.toString(),
      user_id: data.userId,
      email_token: data.emailToken,
      date_created: data.dateCreated,
      date_deleted: data.dateDeleted,
    }
  }
}
