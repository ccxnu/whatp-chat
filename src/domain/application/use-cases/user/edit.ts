import { Injectable } from '@nestjs/common';

import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserGenders } from '@/domain/enums/user-gender';


interface EditUserUseCaseRequest
{
	userId: string;
	phone: null | string;
  gender: null | UserGenders;
  dateOfBirth: null | string;
}

type EditUserUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class EditUserUseCase
{
	constructor(private userRepository: UserRepository)
  {}

	async execute({
		userId,
		phone,
    gender,
    dateOfBirth,
	}: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse>
  {
		const user = await this.userRepository.findById(userId);

		if (!user)
    {
			return left(new ResourceNotFoundError());
		}

		if (phone) user.phone = phone;
		if (gender) user.gender = gender;
		if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);

		await this.userRepository.edit(user);

		return right({})
	}
}
