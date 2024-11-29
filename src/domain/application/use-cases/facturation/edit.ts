import { Injectable } from '@nestjs/common';

import { FacturationRepository } from '@/application/repositories/facturation.repository';
import { UserRepository } from '@/application/repositories/user.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

interface UseCaseRequest
{
  userId: string;
  legalName?: string;
  rucOrCedula?: string;
  phoneNumber?: string;
  accountingEmail?: string;
  province?: string;
  canton?: string;
  mainStreet?: string;
  addressNumber?: string;
  secondaryStreet?: string;
  isMemberOfEquinoccioNetwork?: boolean;
}

type UseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError | ResourceNotFoundError,
  object
>

@Injectable()
export class EditFacturationUseCase
{
  constructor(
    private readonly cooperativeRepository: FacturationRepository,
    private readonly userRepository: UserRepository,
  )
  {}

  async execute({
    userId,
    legalName,
    rucOrCedula,
    phoneNumber,
    accountingEmail,
    province,
    canton,
    mainStreet,
    addressNumber,
    secondaryStreet,
    isMemberOfEquinoccioNetwork,
  }: UseCaseRequest): Promise<UseCaseResponse>
  {
		const user = await this.userRepository.findById(userId);

		if (!user)
    {
			return left(new ResourceNotFoundError());
		}

    const facturation = await this.cooperativeRepository.findById(user.facturationId.toString());

		if (!facturation)
    {
			return left(new ResourceNotFoundError());
		}

    if (legalName) facturation.legalName = legalName;
    if (rucOrCedula) facturation.rucOrCedula = rucOrCedula;
    if (phoneNumber) facturation.phoneNumber = phoneNumber;
    if (accountingEmail) facturation.accountingEmail = accountingEmail;
    if (province) facturation.province = province;
    if (canton) facturation.canton = canton;
    if (mainStreet) facturation.mainStreet = mainStreet;
    if (addressNumber) facturation.addressNumber = addressNumber;
    if (secondaryStreet) facturation.secondaryStreet = secondaryStreet;
    if (isMemberOfEquinoccioNetwork !== undefined) facturation.isMemberOfEquinoccioNetwork = isMemberOfEquinoccioNetwork;

    await this.cooperativeRepository.edit(facturation);

    return right({});
  }
}
