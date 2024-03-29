import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorModel {
  message: string;
  errorCode?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorData = {
      message: (exception as Error).message,
      errorCode: null,
    } as ErrorModel;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorData = exception.getResponse() as ErrorModel;
    }

    res.status(statusCode).json({
      statusCode,
      ok: statusCode > 199 && statusCode < 400,
      data: {
        path: req.url,
        timestamp: new Date().toISOString(),
        ...errorData,
        message: Array.isArray(errorData.message)
          ? errorData.message[0]
          : errorData.message,
      },
    });
  }
}
