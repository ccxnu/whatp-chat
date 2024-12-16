import { Injectable } from '@nestjs/common';

import { FacturationRepository } from '@/application/repositories/facturation.repository';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Facturation } from '@/domain/entities/facturation';

interface UseCaseRequest
{
  userId: string;
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
}

type UseCaseResponse = Either<
  ResourceNotFoundError,
  {
    facturation: Facturation;
  }
>

@Injectable()
export class CreateFacturationUseCase
{
  constructor(
    private readonly cooperativeRepository: FacturationRepository,
    private readonly userRepository: UserRepository,
  )
  {}

  async execute(props: UseCaseRequest): Promise<UseCaseResponse>
  {
		const user = await this.userRepository.findById(props.userId);

		if (!user)
    {
			return left(new ResourceNotFoundError());
		}

    const facturation = Facturation.create(props);

    await this.cooperativeRepository.create(facturation);

    await this.userRepository.edit(user);

    return right({ facturation });
  }
}
