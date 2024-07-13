import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from "@nestjs/common";
import { Response } from 'express';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Internal Server Error';

    response.status(statusCode).json({
      success: false,
      message,
      error: exception.name,
      statusCode,
    });
  }
}
