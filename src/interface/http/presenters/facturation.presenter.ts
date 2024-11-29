import { Facturation } from '@/domain/entities/facturation'

export class FacturationPresenter
{
	static toHttp(details: Facturation)
  {
		return {
      id: details.id.toString(),
      legalName: details.legalName,
      rucOrCedula: details.rucOrCedula,
      phoneNumber: details.phoneNumber,
      accountingEmail: details.accountingEmail,
      province: details.province,
      canton: details.canton,
      mainStreet: details.mainStreet,
      addressNumber: details.addressNumber,
      secondaryStreet: details.secondaryStreet,
      isMemberOfEquinoccioNetwork: details.isMemberOfEquinoccioNetwork,
      dateCreated: details.dateCreated,
      dateUpdated: details.dateUpdated,
    }
	}
}
