import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiResponse } from '../http/api-response.js';
import type { RequestWithId } from '../middleware/request-context.middleware.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();
    const path = request.url ?? '/';
    const requestId = request.requestId;

    const envelope = this.toFailure(exception, path, requestId);
    this.log(exception, envelope.error);
    response.status(envelope.error.statusCode).json(envelope);
  }

  private toFailure(exception: unknown, path: string, requestId?: string) {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const raw = exception.getResponse();
      const { message, details } = ApiResponse.normalizeMessage(
        raw,
        exception.message,
      );
      const errorLabel =
        typeof raw === 'object' &&
        raw !== null &&
        'error' in raw &&
        typeof (raw as { error?: unknown }).error === 'string'
          ? (raw as { error: string }).error
          : HttpStatus[statusCode] ?? 'Error';

      return ApiResponse.failure(
        {
          statusCode,
          error: String(errorLabel),
          code: ApiResponse.codeForStatus(statusCode, details),
          message,
          ...(details?.length ? { details } : {}),
        },
        path,
        requestId,
      );
    }

    const isProd = process.env.NODE_ENV === 'production';
    return ApiResponse.failure(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        code: 'INTERNAL_ERROR',
        message: isProd
          ? 'An unexpected error occurred'
          : exception instanceof Error
            ? exception.message
            : 'An unexpected error occurred',
      },
      path,
      requestId,
    );
  }

  private log(
    exception: unknown,
    error: { statusCode: number; code: string; path: string; message: string },
  ): void {
    if (error.statusCode >= 500) {
      this.logger.error(
        `${error.code} ${error.statusCode} ${error.path} — ${error.message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
      return;
    }
    this.logger.warn(
      `${error.code} ${error.statusCode} ${error.path} — ${error.message}`,
    );
  }
}
