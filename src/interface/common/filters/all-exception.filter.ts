import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

interface IError
{
  message: string;
  errors?: any;
  reason?: any;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter
{
  catch(exception: Error | HttpException, host: ArgumentsHost)
  {
    const response = host.switchToHttp().getResponse();

    //const status = exception instanceof HttpException
    //  ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? (exception.getResponse() as IError)
      : { message: exception.message };

    const errors = message.errors ?? message.reason ?? null; // Extraemos errores si existen.

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
