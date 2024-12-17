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
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { ZodValidationPipe } from '@/interface/http/pipes/zod-validation.pipe';
import { UserDetailsPresenter } from '@/interface/http/presenters/user-details.presenter';

const schema = z.object({
  role: z.nativeEnum(UserRoles).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  perPage: z.coerce.number().min(1).max(50).optional().default(20),
})

type FetchBodySchema = z.infer<typeof schema>;
const bodyValidationPipe = new ZodValidationPipe(schema);

@Controller('/user/search-by-filter')
export class FetchUserAccountController
{
	constructor(private readonly fetchUseCase: FetchUserUseCase)
  {}

	@Post()
	@HttpCode(200)
  @Roles(UserRoles.ADMINISTRADOR)
	async handle(@Body(bodyValidationPipe) body: FetchBodySchema)
  {

		const result = await this.fetchUseCase.execute({
      ...body
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
