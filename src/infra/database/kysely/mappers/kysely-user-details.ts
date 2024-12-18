import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UserDetails } from '@/domain/value-objects/user-details'

import { UserTable } from '../tables/user.table'

export class KyselyUserDetailsMapper
{
	static toDomain(raw: UserTable): UserDetails
  {
		return UserDetails.create(
			{
        userId: new UniqueEntityId(raw.id),
				role: raw.role,
				cedula: raw.cedula,
				email: raw.email,
        fullName: raw.full_name,
        phone: raw.phone,
        gender: raw.gender,
        dateCreated: raw.date_created,
        dateUpdated: raw.date_updated,
			},
		)
	}
}
