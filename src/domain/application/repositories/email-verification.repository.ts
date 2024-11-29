import { EmailVerification } from "@/domain/entities/email-verification";
import { User } from "@/domain/entities/user";

export abstract class EmailVerificationRepository
{
  abstract create(data: EmailVerification): Promise<void>
  abstract edit(data: EmailVerification, user: User): Promise<void>
  abstract delete(data: EmailVerification): Promise<void>
  abstract findOne(emailToken: string, userId: string): Promise<EmailVerification | null>
  abstract findOnebyUserId(userId: string): Promise<EmailVerification | null>
}
