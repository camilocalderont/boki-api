// src/api/shared/pipes/joi-validation.pipe.ts

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error, value: validatedValue } = this.schema.validate(value, {
      abortEarly: false, // Retorna todos los errores, no solo el primero
      allowUnknown: false, // No permite campos desconocidos
      stripUnknown: true // Remueve campos desconocidos
    });

    if (error) {
      // Formatear errores según el estándar de respuesta del proyecto
      const formattedErrors = error.details.map(detail => ({
        code: 'VALIDATION_ERROR',
        field: detail.path.join('.'),
        message: detail.message
      }));

      throw new BadRequestException(
        formattedErrors,
        'Error de validación en los datos enviados'
      );
    }

    return validatedValue;
  }
}