//성공 응답 래핑

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiSuccessResponse } from '../dto/api-response.dto';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Interceptor : 로깅, 응답 변환, 캐싱 같은 공통 처리
 */
@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          path: request?.url ?? '',
        };
      }),
    );
  }
}
