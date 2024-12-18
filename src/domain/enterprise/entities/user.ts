import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { EmailStatus } from '@/domain/enums/user-email-status';
import { UserGenders } from '@/domain/enums/user-gender';
import { UserRoles } from '@/domain/enums/user-roles';

export interface UserProps
{
	fullName: string;
	password: string;
	email: string;
  cedula: string;
  phone: string;
	gender: UserGenders;

  //isTfaEnable: boolean;
  //tfaSecretTfa: string;
	role: UserRoles;
  emailStatus: EmailStatus;
  dateCreated: Date;
  dateUpdated: Date;
}

export class User extends Entity<UserProps>
{
	get fullName()
  {
		return this.props.fullName;
	}

	set fullName(name: string)
  {
		this.props.fullName = name;
	}

	get password()
  {
		return this.props.password;
	}

	set password(password: string)
  {
		this.props.password = password;
	}

	get email()
  {
		return this.props.email;
	}

	set email(email: string)
  {
		this.props.email = email;
	}

	get cedula()
  {
		return this.props.cedula;
	}

	set cedula(cedula: string)
  {
		this.props.cedula = cedula;
	}

	get phone()
  {
		return this.props.phone;
	}

	set phone(phone: string)
  {
		this.props.phone = phone;
	}

	get gender()
  {
		return this.props.gender;
	}

	set gender(gender: UserGenders)
  {
		this.props.gender = gender;
	}

	get role()
  {
		return this.props.role;
	}

	set role(role: UserRoles)
  {
		this.props.role = role;
	}

	get emailStatus()
  {
		return this.props.emailStatus;
	}

	set emailStatus(status: EmailStatus)
  {
		this.props.emailStatus = status;
	}

	get dateCreated()
  {
		return this.props.dateCreated;
	}

	get dateUpdated()
  {
		return this.props.dateUpdated;
	}

	updateUser()
  {
		this.props.dateUpdated = new Date();
	}

	static create(
    props: Optional<
      UserProps,
      'dateCreated' |
      'dateUpdated'>,
    id?: UniqueEntityId
  )
  {
		const user = new User(
      {
        ...props,
				dateCreated: props.dateCreated ?? new Date(),
				dateUpdated: props.dateUpdated ?? new Date(),
      },
      id
    );

		return user;
	}
}
