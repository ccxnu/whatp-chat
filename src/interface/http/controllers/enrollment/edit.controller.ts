import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod';

import { EditEnrollmentUseCase } from '@/application/use-cases/enrollment/edit';
import { CreateResponse } from '@/core/entities/response';
import { UserRoles } from '@/core/repositories/roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';

const createBodySchema = z.object({
  id: z.string(),
  hasAccess: z.coerce.boolean().optional(),
  isCompleted: z.coerce.boolean().optional(),
})

type CreateBodySchema = z.infer<typeof createBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createBodySchema);

@Controller('/enrollment/edit')
export class EditEnrollmentController
{
	constructor(private readonly editUseCase: EditEnrollmentUseCase)
  {}

	@Post()
	@HttpCode(201)
  @Roles(UserRoles.ADMINISTRADOR)
	async handle(@Body(bodyValidationPipe) body: CreateBodySchema)
  {
    const { hasAccess, isCompleted, id } = body;

		const response = await this.editUseCase.execute({ enrollmentId: id, hasAccess, isCompleted });

		if (response.isLeft())
    {
			const error = response.value;

			switch (error.constructor)
      {
				default:
					throw new BadRequestException(error.message);
			}
		}

    return CreateResponse({});
	}
}
