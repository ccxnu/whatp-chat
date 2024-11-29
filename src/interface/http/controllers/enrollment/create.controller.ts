import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post  } from '@nestjs/common';
import { z } from 'zod';

import { AlreadyExistsError } from '@/application/errors/entity-already-exists-error';
import { CreateEnrollmentUseCase } from '@/application/use-cases/enrollment/create';
import { ResponseProcess } from '@/core/entities/response';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';

const createBodySchema = z.object({
  courseId: z.string(),
})

type CreateBodySchema = z.infer<typeof createBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createBodySchema);

@Controller('/enrollment/create')
export class CreateEnrollmentController
{
	constructor(private readonly createUseCase: CreateEnrollmentUseCase)
  {}

	@Post()
	@HttpCode(201)
	async handle(
    @Body(bodyValidationPipe) body: CreateBodySchema,
    @ActiveUser() user: IActiveUser
  )
  {
    const { courseId } = body;
    const { sub } = user;

		const response = await this.createUseCase.execute({ userId: sub, courseId });

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
