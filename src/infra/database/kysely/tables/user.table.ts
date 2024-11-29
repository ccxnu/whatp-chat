import { EmailStatus } from "@/core/repositories/email-status";
import { UserGenders } from "@/core/repositories/genders";
import { UserRoles } from "@/core/repositories/roles";
import { EducationLevel } from "@/domain/enums/education-level";
import { JobPosition } from "@/domain/enums/job-position";
import { ParticipationInCooperative } from "@/domain/enums/participation-cooperative";

export interface UserTable
{
  id: string;
	first_names: string;
	last_names: string;
  username: string;
	password: string;
	email: string;
  cedula: string;
  phone: string;
	gender: UserGenders;
	birth_date: Date;
  city: string | null;
  has_disability: boolean | null;
  education_level: EducationLevel | null;
  participation_in_cooperative: ParticipationInCooperative | null;
  job_position: JobPosition | null;
  facturation_id: string | null;
	role: UserRoles;
  email_status: EmailStatus;
  date_created: Date;
  date_updated: Date;
	date_deleted: Date | null;
}
