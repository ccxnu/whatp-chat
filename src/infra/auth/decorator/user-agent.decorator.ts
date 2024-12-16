import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { REQUEST_USER_AGENT } from '../constants';

export const UserAgent = createParamDecorator(
  (ctx: ExecutionContext) =>
  {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const agent: string | undefined = request.headers[REQUEST_USER_AGENT];
    return agent;
  },
);
