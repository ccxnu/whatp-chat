import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { EmailStatus } from '@/core/repositories/email-status';
import { UserGenders } from '@/core/repositories/genders';
import { UserRoles } from '@/core/repositories/roles';
import { Optional } from '@/core/types/optional';
import { EducationLevel } from '@/domain/enums/education-level';
import { JobPosition } from '@/domain/enums/job-position';
import { ParticipationInCooperative } from '@/domain/enums/participation-cooperative';

export interface UserProps
{
	firstNames: string;
	lastNames: string;
  username: string;
	password: string;
	email: string;
  cedula: string;
  phone: string;
	gender: UserGenders;
	birthDate: Date;

  city: string | null;
  hasDisability: boolean | null;
  educationLevel: EducationLevel | null;
  participationInCooperative: ParticipationInCooperative | null;
  jobPosition: JobPosition | null;

  facturationId: UniqueEntityId | null;

	role: UserRoles;
  emailStatus: EmailStatus;
  dateCreated: Date;
  dateUpdated: Date;
	dateDeleted?: Date | null;
}

export class User extends Entity<UserProps>
{
	get firstNames()
  {
		return this.props.firstNames;
	}

	set firstNames(first_names: string)
  {
		this.props.firstNames = first_names;
	}

	get lastNames()
  {
		return this.props.lastNames;
	}

	set lastNames(last_names: string)
  {
		this.props.lastNames = last_names;
	}

	get username()
  {
		return this.props.username;
	}

	set username(username: string)
  {
		this.props.username = username;
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

	get birthDate()
  {
		return this.props.birthDate;
	}

	set birthDate(birthDate: Date)
  {
		this.props.birthDate = birthDate;
	}

	get city()
  {
		return this.props.city;
	}

	set city(city: string)
  {
		this.props.city = city;
	}

	get hasDisability()
  {
		return this.props.hasDisability;
	}

	set hasDisability(hasDisability: boolean)
  {
		this.props.hasDisability = hasDisability;
	}

	get educationLevel()
  {
		return this.props.educationLevel;
	}

	set educationLevel(level: EducationLevel)
  {
		this.props.educationLevel = level;
	}

	get participationInCooperative()
  {
		return this.props.participationInCooperative;
	}

	set participationInCooperative(part: ParticipationInCooperative)
  {
		this.props.participationInCooperative = part;
	}

	get jobPosition()
  {
		return this.props.jobPosition;
	}

	set jobPosition(job: JobPosition)
  {
		this.props.jobPosition = job;
	}

	get facturationId()
  {
		return this.props.facturationId;
	}

	set facturationId(id: UniqueEntityId | null)
  {
		this.props.facturationId = id;
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

	get dateDeleted()
  {
		return this.props.dateDeleted;
	}

	deleteUser()
  {
		this.props.dateDeleted = new Date();
	}

	recoverUser()
  {
		this.props.dateDeleted = null
	}

	static create(
    props: Optional<
      UserProps,
      'dateCreated' |
      'dateUpdated' |
      'city' |
      'hasDisability' |
      'educationLevel' |
      'participationInCooperative' |
      'jobPosition' |
      'facturationId'>,
    id?: UniqueEntityId
  )
  {
		const user = new User(
      {
        ...props,
        city: props.city ?? null,
        hasDisability: props.hasDisability ?? null,
        educationLevel: props.educationLevel ?? null,
        participationInCooperative: props.participationInCooperative ?? null,
        jobPosition: props.jobPosition ?? null,
        facturationId: props.facturationId ?? null,
				dateCreated: props.dateCreated ?? new Date(),
				dateUpdated: props.dateUpdated ?? new Date(),
      },
      id
    );

		return user;
	}
}
