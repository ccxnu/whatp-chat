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
	fullName: string;
  phone: string;
	gender: UserGenders;
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

	get fullName()
  {
		return this.props.fullName;
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
