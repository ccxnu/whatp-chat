import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UserDetails } from '@/domain/value-objects/user-details'

export class KyselyUserDetailsMapper
{
	static toDomain(raw: any): UserDetails
  {
		return UserDetails.create(
			{
        userId: new UniqueEntityId(raw.id),
				role: raw.role,
				cedula: raw.cedula,
				email: raw.email,
        firstNames: raw.first_names,
        lastNames: raw.last_names,
        phone: raw.phone,
        gender: raw.gender,
        birthDate: raw.birth_date,
        dateCreated: raw.date_created,
        dateUpdated: raw.date_updated,
			},
		)
	}
}
