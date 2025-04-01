import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Schema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: any) {
    const { error, value: validatedValue } = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        code: `VALIDATION_${detail.context.key?.toUpperCase()}`,
        message: detail.message,
        field: detail.context.key
      }));

      throw new BadRequestException({
        apiStatus: false,
        data: null,
        statusType: 'ERROR',
        statusCode: 400,
        statusMessage: 'Validation error in input data',
        errors: errorMessages
      });
    }

    return validatedValue;
  }
}