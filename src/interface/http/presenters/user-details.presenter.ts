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
      fullName: details.fullName,
			phone: details.phone,
      gender: details.gender,
      dateCreated: details.dateCreated,
      dateUpdated: details.dateUpdated,
		}
	}
}
