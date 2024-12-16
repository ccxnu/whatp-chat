import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IActiveUser } from '@/core/repositories/active-user-data';

import { REQUEST_USER_KEY } from '../constants';

export const ActiveUser = createParamDecorator(
  (field: keyof IActiveUser | undefined, ctx: ExecutionContext) =>
    {
      const request = ctx.switchToHttp().getRequest();
      const user: IActiveUser | undefined = request[REQUEST_USER_KEY];

      return field ? user?.[field] : user;
    }
);
