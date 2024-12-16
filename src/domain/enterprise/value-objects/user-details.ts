import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { UserGenders } from '@/domain/enums/user-gender';
import { UserRoles } from '@/domain/enums/user-roles';

export interface UserDetailsProps
{
	userId: UniqueEntityId;
	role: UserRoles;
  cedula: string;
	email: string;
	firstNames: string;
	lastNames: string;
  phone: string;
	gender: UserGenders;
	birthDate: Date;
  dateCreated: Date;
  dateUpdated: Date;
}

export class UserDetails extends ValueObject<UserDetailsProps>
{
	get userId()
  {
		return this.props.userId;
	}

	get role()
  {
		return this.props.role;
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

	get dateCreated()
  {
		return this.props.dateCreated;
	}

	get dateUpdated()
  {
		return this.props.dateUpdated;
	}

	static create(props: UserDetailsProps)
  {
		return new UserDetails(props)
	}

}
