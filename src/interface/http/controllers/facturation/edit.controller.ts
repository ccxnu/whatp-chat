import { BadRequestException, ConflictException, Controller, HttpCode, Post } from '@nestjs/common';

import { AlreadyExistsError } from '@/application/errors/entity-already-exists-error';
import { EditFacturationUseCase } from '@/application/use-cases/facturation/edit';
import { CreateResponse } from '@/core/entities/response';

@Controller('/facturation/edit')
export class EditFacturationController
{
	constructor(private readonly editUseCase: EditFacturationUseCase)
  {}

	@Post()
	@HttpCode(200)
	async handle()
  {
		const response = await this.editUseCase.execute();

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
