import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost)
  {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception.getStatus();

    response.status(status).send({ error: this.mapToError(exception) });
  }

  private mapToError(error: HttpException)
  {
    return {
      message: error.message,
      reasons: this.getReasons(error),
    };
  }

  private getReasons(error: HttpException): string[] | undefined
  {
    if (!(error instanceof BadRequestException)) return;

    const response = error.getResponse() as { message?: string[] };
    return response?.message || [];
  }
}
