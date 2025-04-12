import { Schema } from 'joi';
import { JoiValidationPipe } from './joi-validation.pipe';
export function UseJoiValidationPipe(schemaFactory: (instance: any) => Schema) {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
      // Store the original method
      const originalMethod = descriptor.value;

      // Replace the method with our wrapper
      descriptor.value = function(...args: any[]) {
        // 'this' now refers to the controller instance
        const schema = schemaFactory(this);
        const pipe = new JoiValidationPipe(schema);

        // Look for object arguments which are likely to be the request body
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            // If the argument is an object and not null, it's likely the request body
            if (arg !== null && typeof arg === 'object' && !Array.isArray(arg)) {
            // Skip if it's a Request or Response object
            if (!(arg.constructor &&
                (arg.constructor.name === 'Request' ||
                arg.constructor.name === 'Response'))) {
                // Found the body - validate it
                args[i] = pipe.transform(arg);
                break; // Only validate the first matching object
            }
            }
        }

        // Call the original method with validated args
        return originalMethod.apply(this, args);
      };

      return descriptor;
    };
  }