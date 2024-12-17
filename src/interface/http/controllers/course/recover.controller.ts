import { BadRequestException, Controller, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { RecoverCourseUseCase } from '@/application/use-cases/course/recover';
import { CreateResponse } from '@/core/entities/response';
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';

@Controller('/course/:courseId/recover')
export class RecoverCourseController
{
  constructor(private readonly recoverUseCase: RecoverCourseUseCase)
  {}

	@Post()
  @HttpCode(200)
  @Roles(UserRoles.ADMINISTRADOR)
  async handle(@Param('courseId', ParseUUIDPipe) courseId: string)
  {
		const result = await this.recoverUseCase.execute({ courseId });

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
