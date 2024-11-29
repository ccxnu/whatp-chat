import { EmailVerification } from "@/domain/entities/email-verification";
import { User } from "@/domain/entities/user";

export abstract class MailerRepository
{
	abstract sendVerifyEmail(user: User, data: EmailVerification, ip: string, userAgent: string): Promise<void>
	abstract sendForgotPasswordEmail(user: User, tempPassword: string, ip: string, userAgent: string): Promise<void>
}
