import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, path } = req;
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    const requestTime = Date.now();

    this.logger.log(
      `REQ ${method} ${path} ${className} ${handlerName} invoked...`,
    );

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const { statusCode } = res;
        const time = Date.now() - requestTime;
        this.logger.log(`RES ${method} ${path} ${statusCode} ${time}ms`);
      }),
      catchError((error) => {
        this.logger.error(error);
        return throwError(() => error);
      }),
    );
  }
}
