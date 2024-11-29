import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { IActiveUser } from '@/core/repositories/active-user-data';

import { REQUEST_USER_KEY } from '../constants';

export const ActiveUser = createParamDecorator(
  (field: keyof IActiveUser | undefined, ctx: ExecutionContext) =>
    {
      const request = ctx.switchToHttp().getRequest<FastifyRequest>();
      const user: IActiveUser | undefined = request[REQUEST_USER_KEY];

      return field ? user?.[field] : user;
    }
);
