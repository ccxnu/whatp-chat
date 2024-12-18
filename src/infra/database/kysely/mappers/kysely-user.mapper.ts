import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/entities/user';

import { UserTable } from '../tables/user.table'

export class KyselyUserMapper
{
	static toDomain(raw: UserTable): User
  {
		return User.create(
			{
        fullName: raw.full_name,
				password: raw.password,
				email: raw.email,
				cedula: raw.cedula,
        phone: raw.phone,
        gender: raw.gender,
				role: raw.role,
        emailStatus: raw.email_status,
        dateCreated: raw.date_created,
        dateUpdated: raw.date_updated,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toKysely(user: User): UserTable
  {
		return {
      id: user.id.toString(),
      full_name: user.fullName,
      password: user.password,
      email: user.email,
      cedula: user.cedula,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
      email_status: user.emailStatus,
      date_created: user.dateCreated,
      date_updated: user.dateUpdated,
		}
	}
}
