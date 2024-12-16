import { Injectable } from '@nestjs/common';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { CertificateRepository } from '@/application/repositories/certificate.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CertificateDetails } from '@/domain/value-objects/certificate-details';

interface SearchCertificateRequest
{
	cedula: string;
}

type SearchCertificateResponse = Either<
	InvalidQueryLengthError | ResourceNotFoundError,
	{
		certificates: CertificateDetails[];
	}
>

@Injectable()
export class SearchCertificateUseCase
{
	constructor(private readonly certificateRepository: CertificateRepository)
  {}

	async execute({
    cedula
  }: SearchCertificateRequest): Promise<SearchCertificateResponse>
  {
		const certificates = await this.certificateRepository.findByCedula(cedula);

    if (!certificates)
    {
      return left(new ResourceNotFoundError());
    }

		return right({ certificates })
	}
}
