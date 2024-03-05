import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Reflector } from '@nestjs/core';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map<T, Response<T>>((data) => ({
        message:
          this.reflector.get<string>(
            'response_message',
            context.getHandler(),
          ) || '',
        statusCode: context.switchToHttp().getResponse<Response<T>>()
          .statusCode,
        data,
      })),
    );
  }
}
