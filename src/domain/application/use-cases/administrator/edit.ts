import { Injectable } from '@nestjs/common';

import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserGenders } from '@/domain/enums/user-gender';
import { UserRoles } from '@/domain/enums/user-roles';


interface EditAdminUseCaseRequest
{
	userId: string;
	fullName?: string;
	phone?: string;
  gender?: UserGenders;
  birthDate?: Date;
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
		fullName,
		phone,
    gender,
    birthDate,
    role,
	}: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse>
  {
		const user = await this.userRepository.findById(userId);

		if (!user)
    {
			return left(new ResourceNotFoundError());
		}

		if (fullName) user.fullName = fullName;
		if (phone) user.phone = phone;
		if (gender) user.gender = gender;
		if (birthDate) user.dateOfBirth = birthDate;
    if (role) user.role = role;

		await this.userRepository.edit(user);

		return right({})
	}
}
