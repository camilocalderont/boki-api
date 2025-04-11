// src/api/shared/utils/pipes/joi-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Schema } from 'joi';
import { ApiErrorItem, ApiErrorResponse } from '../../interfaces/api-response.interface';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: any) {
    const { error, value: validatedValue } = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorItems: ApiErrorItem[] = error.details.map(detail => ({
        code: `VALIDATION_${detail.context.key?.toUpperCase()}`,
        message: detail.message,
        field: detail.context.key
      }));

      const errorResponse: ApiErrorResponse = {
        status: 'error',
        message: 'Errores de validación en los datos de entrada',
        errors: errorItems
      };

      throw new BadRequestException(errorResponse);
    }

    return validatedValue;
  }
}