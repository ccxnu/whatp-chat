import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
} from '@nestjs/common';
import { z } from 'zod';

import { MinQuerySearchNotProviedError } from '@/application/errors/expected-one-search-param-error';
import { FetchUserUseCase } from '@/application/use-cases/user/fetch';
import { UserRoles } from '@/core/repositories/roles';
import { EducationLevel } from '@/domain/enums/education-level';
import { JobPosition } from '@/domain/enums/job-position';
import { ParticipationInCooperative } from '@/domain/enums/participation-cooperative';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';
import { UserDetailsPresenter } from '@/interface/http/presenters/user-details.presenter';

const BodySchema = z.object({
  hasDisability: z.boolean().optional(),
  educationLevel: z.nativeEnum(EducationLevel).optional(),
  participationInCooperative: z.nativeEnum(ParticipationInCooperative).optional(),
  jobPosition: z.nativeEnum(JobPosition).optional(),
  role: z.nativeEnum(UserRoles).optional(),
  deleted: z.boolean().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  perPage: z.coerce.number().min(1).max(50).optional().default(20),
})

type FetchBodySchema = z.infer<typeof BodySchema>;
const bodyValidationPipe = new ZodValidationPipe(BodySchema);

@Controller('/user/search-by-filter')
export class FetchUserAccountController
{
	constructor(private readonly fetchUseCase: FetchUserUseCase)
  {}

	@Post()
	@HttpCode(200)
  @Roles(UserRoles.ADMINISTRATOR)
	async handle(@Body(bodyValidationPipe) body: FetchBodySchema)
  {

    const {
      hasDisability,
      educationLevel,
      participationInCooperative,
      jobPosition,
      role,
      deleted,
      page,
      perPage,
    } = body;

		const result = await this.fetchUseCase.execute({
      hasDisability,
      educationLevel,
      participation: participationInCooperative,
      jobPosition,
      role,
			deleted,
			page,
			perPage,
		})

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				case MinQuerySearchNotProviedError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			data: result.value.data.map((item) =>
				UserDetailsPresenter.toHttp(item),
			),
			totalItems: result.value.totalItems,
			totalPages: result.value.totalPages,
			perPage: result.value.perPage,
		}
	}
}
