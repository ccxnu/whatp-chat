import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod';

import { ChangeUserPasswordUseCase } from '@/application/use-cases/user/change-password';
import { ResponseProcess } from '@/core/entities/response';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';


const editAccountPasswordBodySchema = z.object({
	password: z.string().min(8).max(60),
})

type EditAccountPasswordBodySchema = z.infer<typeof editAccountPasswordBodySchema>
const bodyValidationPipe = new ZodValidationPipe(editAccountPasswordBodySchema)

@Controller('/user/change-password')
export class ChangeUserPasswordController
{
	constructor(private readonly changePasswordUseCase: ChangeUserPasswordUseCase)
  {}

	@Post()
	@HttpCode(200)
	async handle(
		@Body(bodyValidationPipe) body: EditAccountPasswordBodySchema,
    @ActiveUser() user: IActiveUser,
	)
  {
    const { sub } = user;

		const result = await this.changePasswordUseCase.execute({
			userId: sub,
			password: body.password,
		});

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				default:
					throw new BadRequestException(error.message)
			}
		}

    return new ResponseProcess();
	}
}
