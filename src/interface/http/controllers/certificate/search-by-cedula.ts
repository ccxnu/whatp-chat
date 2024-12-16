import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
} from '@nestjs/common';
import { z } from 'zod';

import { InvalidQueryLengthError } from '@/application/errors/invalid-query-length-error';
import { SearchCertificateUseCase } from '@/application/use-cases/certificate/search-by-cedula';
import { CreateResponse } from '@/core/entities/response';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';
import { CertificateDetailsPresenter } from '@/interface/http/presenters/certificate-details.presenter';

const bodySchema = z.object({
  cedula: z.string().length(10),
})

type BodySchema = z.infer<typeof bodySchema>
const bodyValidationPipe = new ZodValidationPipe(bodySchema)

@Controller('/user/certificate/search')
export class SearchCertificateController
{
	constructor(private readonly searchUseCase: SearchCertificateUseCase)
  {}

	@Post()
	@HttpCode(200)
	async handle(
    @Body(bodyValidationPipe) body: BodySchema,
	)
  {
    const { cedula } = body;

		const response = await this.searchUseCase.execute({ cedula })

		if (response.isLeft())
    {
			const error = response.value;

			switch (error.constructor)
      {
				case InvalidQueryLengthError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

    return CreateResponse(
       response.value.certificates.map((item) =>
         CertificateDetailsPresenter.toHttp(item))
    );
	}
}
