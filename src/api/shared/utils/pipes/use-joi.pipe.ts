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