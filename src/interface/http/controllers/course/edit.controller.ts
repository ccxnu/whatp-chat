import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
} from '@nestjs/common';
import { z } from 'zod';

import { EditCourseUseCase } from '@/application/use-cases/course/edit';
import { CreateResponse } from '@/core/entities/response';
import { CourseLevel } from '@/core/repositories/course-level';
import { CourseModality } from '@/core/repositories/course-modalidad';
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';

const editAccountBodySchema = z.object({
  courseId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  duration: z.number().positive().optional(),
  category: z.string().optional(),
  level: z.nativeEnum(CourseLevel).optional(),
  modality: z.nativeEnum(CourseModality).optional(),
  startDate: z.coerce.date({ message: 'Invalid Format, use YYYY-MM-DD' }).optional(),
  isPopular: z.coerce.boolean().optional(),
  tags: z.string().array().optional(),
})

type EditAccountBodySchema = z.infer<typeof editAccountBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(editAccountBodySchema);

@Controller('/course/edit')
export class EditCourseController
{
	constructor(private editUseCase: EditCourseUseCase)
  {}

	@Post()
	@HttpCode(200)
  @Roles(UserRoles.ADMINISTRADOR)
	async handle(@Body(bodyValidationPipe) body: EditAccountBodySchema)
  {
		const {
      courseId,
      name,
      description,
      price,
      duration,
      category,
      level,
      modality,
      startDate,
      isPopular,
      tags,
    } = body;

		const result = await this.editUseCase.execute({
      courseId,
      name,
      description,
      price,
      duration,
      category,
      level,
      modality,
      startDate,
      isPopular,
      tags,
		});

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				default:
					throw new BadRequestException(error.message);
			}
		}

    return CreateResponse({});
	}
}
