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
import { CreateResponse } from '@/core/entities/response';
import { UserGenders } from '@/domain/enums/user-gender';
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';

import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';

const editAccountBodySchema = z.object({
  userId: z.string(),
	fullName: z.string().optional(),
	phone: z.string().optional(),
  gender: z.nativeEnum(UserGenders).optional(),
  birthDate: z.coerce.date({ message: 'Invalid Format, use YYYY-MM-DD' }).optional(),
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
  @Roles(UserRoles.ADMINISTRADOR)
	async handle(@Body(bodyValidationPipe) body: EditAccountBodySchema)
  {
		const {
      userId,
      fullName,
      phone,
      gender,
      birthDate,
      role
    } = body;

		const result = await this.editUseCase.execute({
      userId,
      fullName,
      phone,
      gender,
      birthDate,
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

    return CreateResponse({});
	}
}
