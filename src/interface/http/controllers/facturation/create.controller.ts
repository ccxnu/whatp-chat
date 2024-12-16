import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod';

import { AlreadyExistsError } from '@/application/errors/entity-already-exists-error';
import { CreateFacturationUseCase } from '@/application/use-cases/facturation/create';
import { CreateResponse } from '@/core/entities/response';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';

const BodySchema = z.object({
  legalName: z.string(),
  rucOrCedula: z.string().min(10).max(13),
	phoneNumber: z.string().min(10).max(15),
  accountingEmail: z.string().email(),
  province: z.string(),
  canton: z.string(),
  mainStreet: z.string(),
  addressNumber: z.string(),
  secondaryStreet: z.string(),
  isMemberOfEquinoccioNetwork: z.boolean(),
})

type CreateBodySchema = z.infer<typeof BodySchema>

const bodyValidationPipe = new ZodValidationPipe(BodySchema);

@Controller('/facturation/create')
export class CreateFacturationController
{
	constructor(private readonly createUseCase: CreateFacturationUseCase)
  {}

	@Post()
	@HttpCode(201)
	async handle(
    @Body(bodyValidationPipe) body: CreateBodySchema,
    @ActiveUser() user: IActiveUser
  )
  {
    const {
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
    } = body;

		const response = await this.createUseCase.execute({
      userId: user.sub,
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
    });

    if (response.isLeft())
    {
      const error = response.value;

      switch (error.constructor)
      {
        case AlreadyExistsError:
					throw new ConflictException(error.message);
        default:
					throw new BadRequestException(error.message);
      }
    }

    return CreateResponse({});
	}
}
