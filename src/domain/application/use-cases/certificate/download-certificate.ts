import { Injectable } from '@nestjs/common';

import { CertificateRepository } from '@/application/repositories/certificate.repository';
import { TransformerRepository } from '@/application/transformer/transformer';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IRequest
{
	id: string;
}

type CertificateResponse = Either<
	ResourceNotFoundError,
  Buffer
>

@Injectable()
export class DownloadCertificateUseCase
{
	constructor(
    private readonly certificateRepository: CertificateRepository,
    private readonly transformerRepository: TransformerRepository,
  )
  {}

	async execute({ id }: IRequest): Promise<CertificateResponse>
  {
		const certificate = await this.certificateRepository.findByIdWithDetails(id);

		if (!certificate)
    {
			return left(new ResourceNotFoundError());
		}

		const realCertificate = await this.certificateRepository.findById(id);

    realCertificate.numDownloads += 1;

    await this.certificateRepository.edit(realCertificate);

    const pdf = await this.transformerRepository.generateCertificate(certificate);

		return right(pdf)
	}
}
