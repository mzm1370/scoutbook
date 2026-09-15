import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiErrorBody, ApiErrorCode } from '@scoutbook/types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const body = this.toErrorBody(exception, request);
    this.log(exception, body);
    response.status(body.statusCode).json(body);
  }

  private toErrorBody(exception: unknown, request: Request): ApiErrorBody {
    const path = request.url ?? '/';
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const raw = exception.getResponse();
      const { message, details } = this.normalizeMessage(raw, exception.message);
      const error =
        typeof raw === 'object' &&
        raw !== null &&
        'error' in raw &&
        typeof (raw as { error?: unknown }).error === 'string'
          ? (raw as { error: string }).error
          : HttpStatus[statusCode] ?? 'Error';

      return {
        statusCode,
        error: String(error),
        code: this.codeForStatus(statusCode, details),
        message,
        ...(details?.length ? { details } : {}),
        path,
        timestamp,
      };
    }

    const isProd = process.env.NODE_ENV === 'production';
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
      message: isProd
        ? 'An unexpected error occurred'
        : exception instanceof Error
          ? exception.message
          : 'An unexpected error occurred',
      path,
      timestamp,
    };
  }

  private normalizeMessage(
    raw: string | object,
    fallback: string,
  ): { message: string; details?: string[] } {
    if (typeof raw === 'string') {
      return { message: raw };
    }

    const payload = raw as { message?: string | string[] };
    if (Array.isArray(payload.message)) {
      const details = payload.message.filter(Boolean);
      return {
        message: 'Validation failed',
        details: details.length ? details : undefined,
      };
    }
    if (typeof payload.message === 'string' && payload.message.length > 0) {
      return { message: payload.message };
    }
    return { message: fallback || 'Request failed' };
  }

  private codeForStatus(
    statusCode: number,
    details?: string[],
  ): ApiErrorCode {
    if (statusCode === HttpStatus.BAD_REQUEST && details?.length) {
      return 'VALIDATION_ERROR';
    }
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'INTERNAL_ERROR';
      default:
        return 'HTTP_ERROR';
    }
  }

  private log(exception: unknown, body: ApiErrorBody): void {
    if (body.statusCode >= 500) {
      this.logger.error(
        `${body.code} ${body.statusCode} ${body.path} — ${body.message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
      return;
    }
    this.logger.warn(
      `${body.code} ${body.statusCode} ${body.path} — ${body.message}`,
    );
  }
}
