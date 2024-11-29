import {
	BadRequestException,
	Body,
	Controller,
	Header,
	HttpCode,
	Post,
    StreamableFile,
} from '@nestjs/common';
import { z } from 'zod';

import { DownloadCertificateUseCase } from '@/application/use-cases/certificate/download-certificate';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';

const BodySchema = z.object({
  id: z.string().length(36),
})

type CreateBodySchema = z.infer<typeof BodySchema>
const bodyValidationPipe = new ZodValidationPipe(BodySchema)

@Controller('/user/certificate/download')
export class DownloadCertificateController
{
	constructor(private readonly downloadUseCase: DownloadCertificateUseCase)
  {}

	@Post()
	@HttpCode(200)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=Certificado.pdf')
	async handle(@Body(bodyValidationPipe) body: CreateBodySchema)
  {
    const { id } = body;

		const response = await this.downloadUseCase.execute({ id });

		if (response.isLeft())
    {
			const error = response.value;

			switch (error.constructor)
      {
				default:
					throw new BadRequestException(error.message);
			}
		}

    return new StreamableFile(response.value);
	}
}
