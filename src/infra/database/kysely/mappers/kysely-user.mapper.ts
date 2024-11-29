import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/entities/user';

import { UserTable } from '../tables/user.table'

export class KyselyUserMapper
{
	static toDomain(raw: UserTable): User
  {
		return User.create(
			{
        firstNames: raw.first_names,
        lastNames: raw.last_names,
				username: raw.username,
				password: raw.password,
				email: raw.email,
				cedula: raw.cedula,
        phone: raw.phone,
        gender: raw.gender,
        birthDate: raw.birth_date,
        city: raw.city,
        hasDisability: raw.has_disability,
        educationLevel: raw.education_level,
        participationInCooperative: raw.participation_in_cooperative,
        jobPosition: raw.job_position,
        facturationId: raw.facturation_id ? new UniqueEntityId(raw.facturation_id) : null,
				role: raw.role,
        emailStatus: raw.email_status,
        dateCreated: raw.date_created,
        dateUpdated: raw.date_updated,
        dateDeleted: raw.date_deleted,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toKysely(user: User): UserTable
  {
		return {
      id: user.id.toString(),
      first_names: user.firstNames,
      last_names: user.lastNames,
      username: user.username,
      password: user.password,
      email: user.email,
      cedula: user.cedula,
      phone: user.phone,
      gender: user.gender,
      birth_date: user.birthDate,
      city: user.city,
      has_disability: user.hasDisability,
      education_level: user.educationLevel,
      participation_in_cooperative: user.participationInCooperative,
      job_position: user.jobPosition,
      facturation_id: user.facturationId ? user.facturationId.toString() : null,
      role: user.role,
      email_status: user.emailStatus,
      date_created: user.dateCreated,
      date_updated: user.dateUpdated,
      date_deleted: user.dateDeleted,
		}
	}
}
