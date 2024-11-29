import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UserDetails } from '@/domain/value-objects/user-details'

export class KyselyUserDetailsMapper
{
	static toDomain(raw: any): UserDetails
  {

		const facturation = !raw.facturation_id ? null : {
      facturationId: new UniqueEntityId(raw.facturation_id),
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
		}

		return UserDetails.create(
			{
        personId: new UniqueEntityId(raw.id),
				role: raw.role,
				username: raw.username,
				cedula: raw.cedula,
				email: raw.email,
        firstNames: raw.first_names,
        lastNames: raw.last_names,
        phone: raw.phone,
        gender: raw.gender,
        birthDate: raw.birth_date,
        city: raw.city,
        hasDisability: raw.has_disability,
        educationLevel: raw.education_level,
        participationInCooperative: raw.participation_in_cooperative,
        facturation: facturation,
        jobPosition: raw.job_position,
        dateCreated: raw.date_created,
        dateUpdated: raw.date_updated,
        dateDeleted: raw.date_deleted,
			},
		)
	}
}
