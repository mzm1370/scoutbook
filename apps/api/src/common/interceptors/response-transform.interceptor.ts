import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '@api/common/http/api-response.js';

type RequestWithId = Request & { requestId?: string };

/**
 * Wraps every successful controller return value in the uniform envelope:
 * `{ success: true, data, meta }`.
 */
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const path = request.url ?? '/';
    const requestId = request.requestId;

    return next.handle().pipe(
      map((data) => {
        if (ApiResponse.isEnvelope(data)) {
          return data;
        }
        return ApiResponse.success(data, path, requestId);
      }),
    );
  }
}
