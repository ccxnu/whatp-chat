export interface EmailVerificationTable
{
  id: string;
  user_id: string;
	email_token: string;
  date_created: Date;
	date_deleted?: Date | null;
}
