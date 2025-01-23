import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor
{
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>
  {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();;

    this.logger.log(`Incoming Req on ${request.url}`, `method=${request.method} ip=${request.ip}`);

    return next.handle().pipe(
      tap(() =>
      {
        this.logger.log(
          `End Req for ${request.url}`,
          `method=${request.method} ip=${request.ip} duration=${Date.now() - now}ms`,
        );
      }),
    );
  }

  /*
  private getIP(request: Request): string
  {
    const ipAddr = request.headers['x-forwarded-for'] as string;

    if (ipAddr)
    {
      const list = ipAddr.split(',');
      return list[list.length - 1].trim().replace('::ffff:', '');
    }

    return request.ip.replace('::ffff:', '');
  }
  */
}
