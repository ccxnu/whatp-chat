import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod';

import { ChangeUserPasswordUseCase } from '@/application/use-cases/user/change-password';
import { CreateResponse } from '@/core/entities/response';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';


const schema = z.object({
	password: z.string().min(8).max(60),
})

type EditPasswordBodySchema = z.infer<typeof schema>
const bodyValidationPipe = new ZodValidationPipe(schema)

@Controller('/user/change-password')
export class ChangeUserPasswordController
{
	constructor(private readonly changePasswordUseCase: ChangeUserPasswordUseCase)
  {}

	@Post()
	@HttpCode(200)
	async handle(
		@Body(bodyValidationPipe) body: EditPasswordBodySchema,
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

    return CreateResponse({});
	}
}
