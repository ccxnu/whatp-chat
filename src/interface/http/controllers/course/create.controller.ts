import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod';

import { AlreadyExistsError } from '@/application/errors/entity-already-exists-error';
import { CreateCourseUseCase } from '@/application/use-cases/course/create';
import { CreateResponse } from '@/core/entities/response';
import { CourseLevel } from '@/core/repositories/course-level';
import { CourseModality } from '@/core/repositories/course-modalidad';
import { UserRoles } from '@/core/repositories/roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';

const createCourseBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  duration: z.number().positive(),
  category: z.string(),
  level: z.nativeEnum(CourseLevel),
  modality: z.nativeEnum(CourseModality),
  startDate: z.coerce.date({ message: 'Invalid Format, use YYYY-MM-DD' }),
  isPopular: z.boolean().optional().default(false),
  tags: z.string().array(),
})

type CreateCourseBodySchema = z.infer<typeof createCourseBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createCourseBodySchema);

@Controller('/course/create')
export class CreateCourseController
{
	constructor(private readonly createCourse: CreateCourseUseCase)
  {}

	@Post()
	@HttpCode(201)
	@Roles(UserRoles.ADMINISTRADOR)
	async handle(@Body(bodyValidationPipe) body: CreateCourseBodySchema)
  {
    const {
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

		const response = await this.createCourse.execute({
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
