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
import { CreateResponse } from '@/core/entities/response';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { UserGenders } from '@/core/repositories/genders';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';

const schema = z.object({
	fullName: z.string().optional(),
  username: z.string().optional(),
	phone: z.string().optional(),
  gender: z.nativeEnum(UserGenders).optional(),
  dateOfBirth: z.coerce.date().optional(),
})

type EditBodySchema = z.infer<typeof schema>;
const bodyValidationPipe = new ZodValidationPipe(schema);

@Controller('/user/edit-account')
export class EditUserAccountController
{
	constructor(private editUseCase: EditUserUseCase)
  {}

	@Post()
	@HttpCode(200)
	async handle(
    @Body(bodyValidationPipe) body: EditBodySchema,
    @ActiveUser() user: IActiveUser
  )
  {
    const { sub } = user;

		const result = await this.editUseCase.execute({ userId: sub, ...body });

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
