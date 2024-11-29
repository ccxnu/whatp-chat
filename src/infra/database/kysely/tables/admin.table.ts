import { UserRoles } from "@/core/repositories/roles";

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
