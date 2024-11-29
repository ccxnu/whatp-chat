import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod';

import { AlreadyExistsError } from '@/application/errors/entity-already-exists-error';
import { EditFacturationUseCase } from '@/application/use-cases/facturation/edit';
import { ResponseProcess } from '@/core/entities/response';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';

const BodySchema = z.object({
  legalName: z.string().optional(),
  rucOrCedula: z.string().min(10).max(13).optional(),
	phoneNumber: z.string().min(10).max(15).optional(),
  accountingEmail: z.string().email().optional(),
  province: z.string().optional(),
  canton: z.string().optional(),
  mainStreet: z.string().optional(),
  addressNumber: z.string().optional(),
  secondaryStreet: z.string().optional(),
  isMemberOfEquinoccioNetwork: z.boolean().optional(),
})

type CreateBodySchema = z.infer<typeof BodySchema>

const bodyValidationPipe = new ZodValidationPipe(BodySchema);

@Controller('/facturation/edit')
export class EditFacturationController
{
	constructor(private readonly editUseCase: EditFacturationUseCase)
  {}

	@Post()
	@HttpCode(200)
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

		const response = await this.editUseCase.execute({
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

    return new ResponseProcess();
	}
}
