import { UserRoles } from "@/domain/enums/user-roles";

export interface AdminTable
{
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
	role: UserRoles;
  //profile_picture: Generated<string | null>;
}
