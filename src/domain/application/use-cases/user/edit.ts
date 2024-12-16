import { Injectable } from '@nestjs/common';

import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserGenders } from '@/core/repositories/genders';


interface EditUserUseCaseRequest
{
	userId: string;
	fullName?: string;
	phone?: string;
  gender?: UserGenders;
  birthDate?: Date;
}

type EditUserUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class EditUserUseCase
{
	constructor(private userRepository: UserRepository)
  {}

	async execute({
		userId,
		fullName,
		phone,
    gender,
    birthDate,
	}: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse>
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

		await this.userRepository.edit(user);

		return right({})
	}
}
