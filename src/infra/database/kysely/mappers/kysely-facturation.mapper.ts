import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Facturation } from '@/domain/entities/facturation'

import { FacturationTable } from '../tables/facturation.table'

export class KyselyFacturationMapper
{
	static toDomain(raw: FacturationTable): Facturation
  {
		return Facturation.create(
      {
        legalName: raw.legal_name,
        rucOrCedula: raw.ruc_or_cedula,
        phoneNumber: raw.phone_number,
        accountingEmail: raw.accounting_email,
        province: raw.province,
        canton: raw.canton,
        mainStreet: raw.main_street,
        addressNumber: raw.addrees_number,
        secondaryStreet: raw.secondary_street,
        isMemberOfEquinoccioNetwork: raw.is_member_of_equinoccio_network,
        dateCreated: raw.date_created,
        dateUpdated: raw.date_updated,
      },
			new UniqueEntityId(raw.id),
    )
  }

	static toKysely(data: Facturation): FacturationTable
  {
		return {
        id: data.id.toString(),
        legal_name: data.legalName,
        ruc_or_cedula: data.rucOrCedula,
        phone_number: data.phoneNumber,
        accounting_email: data.accountingEmail,
        province: data.province,
        canton: data.canton,
        main_street: data.mainStreet,
        addrees_number: data.addressNumber,
        secondary_street: data.secondaryStreet,
        is_member_of_equinoccio_network: data.isMemberOfEquinoccioNetwork,
        date_created: data.dateCreated,
        date_updated: data.dateCreated,
		}
	}
}
