import { Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, ParseIntPipe, Query, BadRequestException, UsePipes } from '@nestjs/common';
import { ICrudService } from '../interfaces/crud.interface';
import { Schema } from 'joi';
import { JoiValidationPipe } from '../utils/pipes/joi-validation.pipe';

// Create a factory function that returns a method decorator
export function UseJoiValidationPipe(schemaFactory: (instance: any) => Schema) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        // Store the original method
        const originalMethod = descriptor.value;

        // Replace the method with our wrapper
        descriptor.value = function (...args: any[]) {
            // 'this' now refers to the controller instance
            const schema = schemaFactory(this);
            const pipe = new JoiValidationPipe(schema);

            // Apply the pipe to the first argument (usually the body)
            if (args.length > 0) {
                args[0] = pipe.transform(args[0]);
            }

            // Call the original method with validated args
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}