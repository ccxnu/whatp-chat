import { UserRoles } from "./roles";

export interface IActiveUser
{
  /**
  * The subject of the token. The value of this property is the user ID.
  */
  sub: string;

  /**
  * The subject's (user) email.
  */
  email: string;

  /**
  * The subject's (user) role.
  */
  role: UserRoles;
}
