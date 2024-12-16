import { UserDetails } from "@/domain/value-objects/user-details";

export class UserDetailsPresenter
{
	static toHttp(details: UserDetails)
  {
		return {
			id: details.userId.toString(),
			role: details.role,
      cedula: details.cedula,
			email: details.email,
      firstNames: details.firstNames,
      lastNames: details.lastNames,
			phone: details.phone,
      gender: details.gender,
      birthDate: details.birthDate,
      dateCreated: details.dateCreated,
      dateUpdated: details.dateUpdated,
		}
	}
}
