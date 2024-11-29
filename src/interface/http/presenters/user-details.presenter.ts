import { UserDetails } from "@/domain/value-objects/user-details";

export class UserDetailsPresenter
{
	static toHttp(details: UserDetails)
  {
		return {
			id: details.personId.toString(),
			role: details.role,
      username: details.username,
      cedula: details.cedula,
			email: details.email,
      firstNames: details.firstNames,
      lastNames: details.lastNames,
			phone: details.phone,
      gender: details.gender,
      birthDate: details.birthDate,
      city: details.city,
      hasDisability: details.hasDisability,
      educationLevel: details.educationLevel,
      participationInCooperative: details.participationInCooperative,
      jobPosition: details.jobPosition,
      facturation: !details.facturation ? null : {
        facturationId: details.facturation.facturationId.toString(),
        legalName: details.facturation.legalName,
        rucOrCedula: details.facturation.rucOrCedula,
        phoneNumber: details.facturation.phoneNumber,
        accountingEmail: details.facturation.accountingEmail,
        province: details.facturation.province,
        canton: details.facturation.canton,
        mainStreet: details.facturation.mainStreet,
        addressNumber: details.facturation.addressNumber,
        secondaryStreet: details.facturation.secondaryStreet,
        isMemberOfEquinoccioNetwork: details.facturation.isMemberOfEquinoccioNetwork,
      },
      dateCreated: details.dateCreated,
      dateUpdated: details.dateUpdated,
		}
	}
}
