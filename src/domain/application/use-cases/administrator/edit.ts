import { Injectable } from '@nestjs/common';

import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserGenders } from '@/core/repositories/genders';
import { UserRoles } from '@/core/repositories/roles';
import { EducationLevel } from '@/domain/enums/education-level';
import { JobPosition } from '@/domain/enums/job-position';
import { ParticipationInCooperative } from '@/domain/enums/participation-cooperative';


interface EditAdminUseCaseRequest
{
	userId: string;
	firstNames?: string;
	lastNames?: string;
	username?: string;
	phone?: string;
  gender?: UserGenders;
  birthDate?: Date;
  city?: string;
  hasDisability?: boolean;
  educationLevel?: EducationLevel;
  participationInCooperative?: ParticipationInCooperative;
  jobPosition?: JobPosition;
  role?: UserRoles;
}

type EditAdminUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class EditAdminUseCase
{
	constructor(private userRepository: UserRepository)
  {}

	async execute({
		userId,
		firstNames,
		lastNames,
    username,
		phone,
    gender,
    birthDate,
    city,
    hasDisability,
    educationLevel,
    participationInCooperative,
    jobPosition,
    role,
	}: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse>
  {
		const user = await this.userRepository.findById(userId);

		if (!user)
    {
			return left(new ResourceNotFoundError());
		}

		const personWithSameData = await this.userRepository.findByUsername(
      username,
		);

		if (personWithSameData && !personWithSameData?.id.equals(user.id))
    {
			return left(new UserAlreadyExistsError(`'${personWithSameData.username}'`));
		}

		if (firstNames) user.firstNames = firstNames;
		if (lastNames) user.lastNames = lastNames;
		if (phone) user.phone = phone;
		if (gender) user.gender = gender;
		if (birthDate) user.birthDate = birthDate;
    if (role) user.role = role;
    if (username) user.username = username;
    if (city) user.city = city;
    if (hasDisability) user.hasDisability = hasDisability;
    if (educationLevel) user.educationLevel = educationLevel;
    if (participationInCooperative) user.participationInCooperative = participationInCooperative;
    if (jobPosition) user.jobPosition = jobPosition;

		await this.userRepository.edit(user);

		return right({})
	}
}
