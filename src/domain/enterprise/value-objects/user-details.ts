import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { UserGenders } from '@/core/repositories/genders';
import { UserRoles } from '@/core/repositories/roles';

import { EducationLevel } from '../enums/education-level';
import { JobPosition } from '../enums/job-position';
import { ParticipationInCooperative } from '../enums/participation-cooperative';

export interface UserDetailsProps
{
	personId: UniqueEntityId;
	role: UserRoles;
  username: string;
  cedula: string;
	email: string;
	firstNames: string;
	lastNames: string;
  phone: string;
	gender: UserGenders;
	birthDate: Date;
  city: string;
  hasDisability: boolean;
  educationLevel: EducationLevel;
  participationInCooperative: ParticipationInCooperative;
  jobPosition: JobPosition;
  facturation: {
    facturationId: UniqueEntityId;
    legalName: string;
    rucOrCedula: string;
    phoneNumber: string;
    accountingEmail: string;
    province: string;
    canton: string;
    mainStreet: string;
    addressNumber: string;
    secondaryStreet: string;
    isMemberOfEquinoccioNetwork: boolean;
  } | null;
  dateCreated: Date;
  dateUpdated: Date;
	dateDeleted: Date | null;
}

export class UserDetails extends ValueObject<UserDetailsProps>
{
	get personId()
  {
		return this.props.personId
	}

	get role()
  {
		return this.props.role
	}

	get username()
  {
		return this.props.username;
	}

	get firstNames()
  {
		return this.props.firstNames;
	}

	get lastNames()
  {
		return this.props.lastNames;
	}

	get cedula()
  {
		return this.props.cedula;
	}

	get email()
  {
		return this.props.email;
	}

	get phone()
  {
		return this.props.phone;
	}

	get gender()
  {
		return this.props.gender;
	}

	get birthDate()
  {
		return this.props.birthDate;
	}

	get city()
  {
		return this.props.city;
	}

	get hasDisability()
  {
		return this.props.hasDisability;
	}

	get educationLevel()
  {
		return this.props.educationLevel;
	}

	get participationInCooperative()
  {
		return this.props.participationInCooperative;
	}

	get jobPosition()
  {
		return this.props.jobPosition;
	}

	get facturation()
  {
		return this.props.facturation;
	}

	get dateCreated()
  {
		return this.props.dateCreated;
	}

	get dateUpdated()
  {
		return this.props.dateUpdated;
	}

	get dateDeleted()
  {
		return this.props.dateDeleted;
	}

	static create(props: UserDetailsProps)
  {
		return new UserDetails(props)
	}

}
