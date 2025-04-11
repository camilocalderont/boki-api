import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse, ApiControllerResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<T>> {
    return next
      .handle()
      .pipe(
        map(responseData => {
          // Usando Type Guards para verificaciones más elegantes
          if (this.isApiSuccessResponse(responseData)) {
            // Si ya tiene el formato correcto (con status), no lo modifiques
            return responseData;
          }

          if (this.isApiControllerResponse(responseData)) {
            // Si el controlador proporciona message y data
            return {
              status: 'success',
              message: responseData.message,
              data: responseData.data
            };
          }

          // Caso simple: solo datos sin formato
          return {
            status: 'success',
            message: 'Operación exitosa',
            data: responseData
          };
        }),
      );
  }

  /**
   * Type Guard para verificar si un objeto es una respuesta ApiSuccessResponse
   */
  private isApiSuccessResponse(obj: any): obj is ApiSuccessResponse {
    return obj !== null &&
           typeof obj === 'object' &&
           'status' in obj &&
           'message' in obj &&
           'data' in obj;
  }

  /**
   * Type Guard para verificar si un objeto es una respuesta ApiControllerResponse
   */
  private isApiControllerResponse(obj: any): obj is ApiControllerResponse {
    return obj !== null &&
           typeof obj === 'object' &&
           'message' in obj &&
           'data' in obj &&
           !('status' in obj); // Para asegurarnos de que no es ApiSuccessResponse
  }
}