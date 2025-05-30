import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DateFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => this.transformResponse(data)),
    );
  }

  private transformResponse(response: any): any {
    if (!response) return response;
    
    return this.processDateValues(response);
  }

  private processDateValues(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (data instanceof Date) {
      return this.formatToColombianDate(data);
    }
    if (Array.isArray(data)) {
      return data.map(item => this.processDateValues(item));
    }

    if (typeof data === 'object') {
      const result = { ...data };
      
      for (const key of Object.keys(result)) {
        if (
          (key.includes('_at') || key.includes('date') || key === 'fecha' || key === 'created_at' || key === 'updated_at') && 
          (result[key] instanceof Date || this.isDateString(result[key]))
        ) {
          result[key] = this.formatToColombianDate(new Date(result[key]));
        } else if (typeof result[key] === 'object' && result[key] !== null) {
          result[key] = this.processDateValues(result[key]);
        }
      }
      
      return result;
    }
    return data;
  }

  private isDateString(value: any): boolean {
    if (typeof value !== 'string') return false;
    return !isNaN(Date.parse(value));
  }

  private formatToColombianDate(date: Date): string {
    if (!date) return null;
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
