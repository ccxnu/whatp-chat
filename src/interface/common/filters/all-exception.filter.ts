import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

interface IError
{
  message: string;
  errors?: any;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter
{
  catch(exception: Error | HttpException, host: ArgumentsHost)
  {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    //const status = exception instanceof HttpException
    //  ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? (exception.getResponse() as IError)
      : { message: exception.message };

    const errors = message.errors ?? null; // Extraemos errores si existen.

    const responseError =
    {
      code: 'COD_ERR',
      result: {},
      info: {
        message: message.message || 'UNKNOWN_ERROR',
        errors,
      },
      status: false,
    };

    response.status(200).send(responseError);
  }
}
