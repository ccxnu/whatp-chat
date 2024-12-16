import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
} from '@nestjs/common';

import { ViewUserUseCase } from '@/application/use-cases/user/view';
import { CreateResponse } from '@/core/entities/response';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { ActiveUser } from '@/infra/auth/decorator/active-user.decorator';
import { UserDetailsPresenter } from '@/interface/http/presenters/user-details.presenter';


@Controller('/user/view-profile')
export class ViewUserAccountController
{
	constructor(private viewUseCase: ViewUserUseCase)
  {}

	@Get()
	@HttpCode(200)
	async handle(@ActiveUser() user: IActiveUser)
  {
    const { sub } = user;

		const result = await this.viewUseCase.execute({
			userId: sub,
		});

		if (result.isLeft())
    {
			const error = result.value;

			switch (error.constructor)
      {
				default:
					throw new BadRequestException(error.message);
			}
		}

		return CreateResponse(UserDetailsPresenter.toHttp(result.value.user));
	}
}
