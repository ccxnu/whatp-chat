import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Post,
} from '@nestjs/common';
import { z } from 'zod';

import { UserAlreadyExistsError } from '@/application/errors/user-already-exists-error';
import { EditUserUseCase } from '@/application/use-cases/user/edit';
import { ResponseProcess } from '@/core/entities/response';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { UserGenders } from '@/core/repositories/genders';
import { EducationLevel } from '@/domain/enums/education-level';
import { JobPosition } from '@/domain/enums/job-position';
import { ParticipationInCooperative } from '@/domain/enums/participation-cooperative';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';

const editAccountBodySchema = z.object({
	firstNames: z.string().optional(),
	lastNames: z.string().optional(),
  username: z.string().optional(),
	phone: z.string().optional(),
  gender: z.nativeEnum(UserGenders).optional(),
  birthDate: z.coerce.date({ message: 'Invalid Format, use YYYY-MM-DD' }).optional(),
  city: z.string().optional(),
  hasDisability: z.boolean().optional(),
  educationLevel: z.nativeEnum(EducationLevel).optional(),
  participationInCooperative: z.nativeEnum(ParticipationInCooperative).optional(),
  jobPosition: z.nativeEnum(JobPosition).optional(),
})

type EditAccountBodySchema = z.infer<typeof editAccountBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(editAccountBodySchema);

@Controller('/user/edit-account')
export class EditUserAccountController
{
	constructor(private editUseCase: EditUserUseCase)
  {}

	@Post()
	@HttpCode(200)
	async handle(
    @Body(bodyValidationPipe) body: EditAccountBodySchema,
    @ActiveUser() user: IActiveUser
  )
  {
		const {
      firstNames,
      lastNames,
      username,
      phone,
      gender,
      birthDate,
      city,
      hasDisability,
      educationLevel,
      participationInCooperative,
      jobPosition,
    } = body;

    const { sub } = user;

		const result = await this.editUseCase.execute({
      userId: sub,
      firstNames,
      lastNames,
      username,
      phone,
      gender,
      birthDate,
      city,
      hasDisability,
      educationLevel,
      participationInCooperative,
      jobPosition,
		});

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				case UserAlreadyExistsError:
					throw new ConflictException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

    return new ResponseProcess();
	}
}
