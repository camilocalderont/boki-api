import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    
    let errorMessage: string;
    const exceptionResponse = exception.getResponse();
    
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      if ('message' in exceptionResponse) {
        errorMessage = Array.isArray(exceptionResponse['message']) 
          ? exceptionResponse['message'][0] 
          : exceptionResponse['message'];
      } else {
        errorMessage = exception.message;
      }
    } else {
      errorMessage = exception.message;
    }
    
    response
      .status(status)
      .json({
        status: 'error',
        message: errorMessage
      });
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message = 
      exception instanceof HttpException
        ? exception.message
        : 'Internal application error';
    
    response
      .status(status)
      .json({
        status: 'error',
        message
      });
  }
}
