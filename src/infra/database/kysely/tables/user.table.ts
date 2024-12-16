import { EmailStatus } from "@/core/repositories/email-status";
import { UserGenders } from "@/core/repositories/genders";
import { UserRoles } from "@/core/repositories/roles";

export interface UserTable
{
  id: string;
	full_name: string;
	password: string;
	email: string;
  cedula: string;
  phone: string;
	gender: UserGenders;
	birth_date: Date;
	role: UserRoles;
  email_status: EmailStatus;
  date_created: Date;
  date_updated: Date;
}
