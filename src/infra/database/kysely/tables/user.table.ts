import { EmailStatus } from "@/domain/enums/user-email-status";
import { UserGenders } from "@/domain/enums/user-gender";
import { UserRoles } from "@/domain/enums/user-roles";

export interface UserTable
{
  id: string;
	full_name: string;
	password: string;
	email: string;
  cedula: string;
  phone: string;
	gender: UserGenders;
	role: UserRoles;
  email_status: EmailStatus;
  date_created: Date;
  date_updated: Date;
}
