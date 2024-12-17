import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common';

import { ViewFacturationUseCase } from '@/application/use-cases/facturation/view';
import { CreateResponse } from '@/core/entities/response';
import { UserRoles } from '@/domain/enums/user-roles';
import { Roles } from '@/infra/auth/decorator/user-roles.decorator';
import { FacturationPresenter } from '@/interface/http/presenters/facturation.presenter';

@Controller('/facturation/:facturationId/view')
export class ViewFacturationController
{
	constructor(private readonly viewUseCase: ViewFacturationUseCase)
  {}

	@Get()
	@HttpCode(200)
  @Roles(UserRoles.ADMINISTRADOR)
	async handle(@Param('facturationId', ParseUUIDPipe) id: string)
  {
		const result = await this.viewUseCase.execute({ facturationId: id });

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				default:
					throw new BadRequestException(error.message);
			}
		}

		return CreateResponse(FacturationPresenter.toHttp(result.value.facturation));
	}
}
