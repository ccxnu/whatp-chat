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
import { EditAdminUseCase } from '@/application/use-cases/administrator/edit';
import { ResponseProcess } from '@/core/entities/response';
import { UserGenders } from '@/core/repositories/genders';
import { UserRoles } from '@/core/repositories/roles';
import { EducationLevel } from '@/domain/enums/education-level';
import { JobPosition } from '@/domain/enums/job-position';
import { ParticipationInCooperative } from '@/domain/enums/participation-cooperative';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';

import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';

const editAccountBodySchema = z.object({
  userId: z.string(),
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
  role: z.nativeEnum(UserRoles).optional(),
})

type EditAccountBodySchema = z.infer<typeof editAccountBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(editAccountBodySchema);

@Controller('/administrator/user/edit-account')
export class EditAdminAccountController
{
	constructor(private editUseCase: EditAdminUseCase)
  {}

	@Post()
	@HttpCode(200)
  @Roles(UserRoles.ADMINISTRATOR)
	async handle(@Body(bodyValidationPipe) body: EditAccountBodySchema)
  {
		const {
      userId,
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
      role
    } = body;

		const result = await this.editUseCase.execute({
      userId,
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
      role
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
