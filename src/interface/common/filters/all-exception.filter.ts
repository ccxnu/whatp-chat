import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

interface IError
{
  message: string;
  code_error: string;
  errors?: any;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter
{
  catch(exception: Error | HttpException, host: ArgumentsHost)
  {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const status = exception instanceof HttpException
      ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? (exception.getResponse() as IError)
      : { message: exception.message, code_error: 'UNKNOWN_ERROR' };

    const errors = message.errors ?? null; // Extraemos errores si existen.

    const responseData =
    {
      code: 'COD_ERR',
      result: {},
      info: {
        message: message.message || 'UNKNOWN_ERROR',
        errors,
      },
      status: false,
    };

    response.status(status).send(responseData);
  }
}
