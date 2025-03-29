import {
  Injectable,
  Logger,
  HttpStatus,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

/**
 * Enumeration of error types for consistent categorization
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
  DATABASE = 'DATABASE_ERROR',
  INTERNAL = 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  BAD_REQUEST = 'BAD_REQUEST_ERROR',
}

/**
 * Interface for standardized responses
 */
export interface ApiResponse<T = any> {
  apiStatus: boolean;
  data: T | null;
  statusType: 'SUCCESS' | 'ERROR' | 'WARNING';
  statusCode: number;
  statusMessage: string;
  requestId?: string;
  timestamp?: string;
  path?: string;
  errors?: ApiError[];
}

/**
 * Interface for detailed errors
 */
export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

/**
 * Service that provides logging methods and response construction
 * (success, error, data, etc.) in a generic and secure way.
 */
@Injectable()
export class LoggingReportService {
  private readonly logger = new Logger(LoggingReportService.name);

  /**
   * Generic success message, without specific data.
   * @param apiName Name or path of the endpoint to contextualize the log
   * @param requestId Unique identifier of the request for tracking
   */
  logging(apiName: string, requestId?: string): ApiResponse {
    const message = 'Operation processed successfully';
    this.logger.log(`[${requestId || 'N/A'}] ${message}`, apiName);
    return {
      apiStatus: true,
      data: null,
      statusType: 'SUCCESS',
      statusCode: HttpStatus.OK,
      statusMessage: message,
      requestId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Detailed error handling with categorization and sanitization.
   * @param apiName Name or path of the endpoint to contextualize the log
   * @param error Captured error
   * @param requestId Unique identifier of the request for tracking
   * @param errorType Error type for categorization
   */
  loggingError(
    apiName: string,
    error: any,
    requestId?: string,
    errorType: ErrorType = ErrorType.INTERNAL
  ): ApiResponse {
    // Sanitize the error to avoid exposure of sensitive information
    const sanitizedError = this.sanitizeError(error);

    // Determine the appropriate HTTP code according to the error type
    const statusCode = this.getHttpStatusFromErrorType(errorType);

    // Create a descriptive but secure message
    const errMessage = this.createErrorMessage(sanitizedError, errorType);

    // Generate a specific error code to facilitate debugging
    const errorCode = this.generateErrorCode(errorType, statusCode);

    // Extract additional details if available
    const errorDetails = this.extractErrorDetails(sanitizedError);

    // Log the error with all relevant information for internal debugging
    this.logger.error(
      `[${requestId || 'N/A'}][${errorType}][${errorCode}] ${errMessage}`,
      sanitizedError.stack || 'No stack trace',
      apiName
    );

    // Build a structured response for the client
    return {
      apiStatus: false,
      data: null,
      statusType: 'ERROR',
      statusCode,
      statusMessage: errMessage,
      requestId,
      timestamp: new Date().toISOString(),
      errors: [
        {
          code: errorCode,
          message: errMessage,
          details: errorDetails,
        },
      ],
    };
  }

  /**
   * Success message with data.
   * @param resultData Data to return in the response
   * @param apiName Name or path of the endpoint to contextualize the log
   * @param requestId Unique identifier of the request for tracking
   */
  loggingData<T>(resultData: T, apiName: string, requestId?: string): ApiResponse<T> {
    const message = 'Information delivered correctly';
    this.logger.log(`[${requestId || 'N/A'}] ${message}`, apiName);
    return {
      apiStatus: true,
      data: resultData,
      statusType: 'SUCCESS',
      statusCode: HttpStatus.OK,
      statusMessage: message,
      requestId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Message indicating that the information was successfully deleted.
   * @param apiName Name or path of the endpoint to contextualize the log
   * @param requestId Unique identifier of the request for tracking
   */
  deletedData(apiName: string, requestId?: string): ApiResponse {
    const message = 'Data deleted successfully';
    this.logger.log(`[${requestId || 'N/A'}] ${message}`, apiName);
    return {
      apiStatus: true,
      data: null,
      statusType: 'SUCCESS',
      statusCode: HttpStatus.OK,
      statusMessage: message,
      requestId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Warning message when the operation completes but with considerations.
   * @param apiName Name or path of the endpoint to contextualize the log
   * @param message Warning message
   * @param data Optional data related to the warning
   * @param requestId Unique identifier of the request for tracking
   */
  loggingWarning<T>(apiName: string, message: string, data?: T, requestId?: string): ApiResponse<T> {
    this.logger.warn(`[${requestId || 'N/A'}] ${message}`, apiName);
    return {
      apiStatus: true, // The operation was technically successful
      data: data || null,
      statusType: 'WARNING',
      statusCode: HttpStatus.OK,
      statusMessage: message,
      requestId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates an error response for data validation.
   * @param validationErrors Validation errors (typically from class-validator)
   * @param apiName Name or path of the endpoint to contextualize the log
   * @param requestId Unique identifier of the request for tracking
   */
  validationError(validationErrors: any[], apiName: string, requestId?: string): ApiResponse {
    const message = 'Validation error in input data';

    // Transform validation errors into our standard format
    const errors: ApiError[] = validationErrors.map(err => ({
      code: `VALIDATION_${err.property?.toUpperCase() || 'FIELD'}`,
      message: Object.values(err.constraints || {}).join(', '),
      field: err.property,
    }));

    this.logger.warn(
      `[${requestId || 'N/A'}][${ErrorType.VALIDATION}] ${message}: ${JSON.stringify(errors)}`,
      apiName
    );

    return {
      apiStatus: false,
      data: null,
      statusType: 'ERROR',
      statusCode: HttpStatus.BAD_REQUEST,
      statusMessage: message,
      requestId,
      timestamp: new Date().toISOString(),
      errors,
    };
  }

  /**
   * Sanitizes the error to avoid exposure of sensitive information.
   * @param error Original error
   */
  private sanitizeError(error: any): any {
    if (!error) return { message: 'Unknown error' };

    // If it's a JavaScript Error object
    if (error instanceof Error) {
      // Create a copy to avoid modifying the original
      const sanitized = {
        message: error.message,
        name: error.name,
        stack: error.stack,
      };

      // Remove potentially sensitive information
      return this.removeSensitiveInfo(sanitized);
    }

    // If it's a string
    if (typeof error === 'string') {
      return { message: this.removeSensitiveInfo(error) };
    }

    // If it's an object
    if (typeof error === 'object') {
      return this.removeSensitiveInfo({ ...error });
    }

    // For any other type
    return { message: 'Unprocessable error' };
  }

  /**
   * Removes sensitive information from error messages.
   * @param data Data to sanitize
   */
  private removeSensitiveInfo(data: any): any {
    // If it's a string, redact sensitive information
    if (typeof data === 'string') {
      // Redact possible tokens, passwords, etc.
      return data
        .replace(/password[=:].*?[&;\s]/gi, 'password=REDACTED ')
        .replace(/token[=:].*?[&;\s]/gi, 'token=REDACTED ')
        .replace(/api[_-]?key[=:].*?[&;\s]/gi, 'api_key=REDACTED ')
        .replace(/auth[=:].*?[&;\s]/gi, 'auth=REDACTED ')
        .replace(/bearer\s+[\w\d._-]+/gi, 'bearer REDACTED')
        .replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, 'REDACTED_CARD_NUMBER');
    }

    // If it's an object, process its properties recursively
    if (data && typeof data === 'object') {
      const sensitiveKeys = [
        'password', 'token', 'apiKey', 'api_key', 'secret',
        'authorization', 'auth', 'key', 'credential', 'pin',
        'cardNumber', 'cvv', 'ssn'
      ];

      // Process each property
      for (const key in data) {
        // If the key is sensitive, redact its value
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
          data[key] = 'REDACTED';
        }
        // If it's not sensitive but is an object or array, process recursively
        else if (data[key] && typeof data[key] === 'object') {
          data[key] = this.removeSensitiveInfo(data[key]);
        }
        // If it's a string, also sanitize it
        else if (typeof data[key] === 'string') {
          data[key] = this.removeSensitiveInfo(data[key]);
        }
      }
    }

    return data;
  }

  /**
   * Determines the appropriate HTTP code according to the error type.
   * @param errorType Error type
   */
  public getHttpStatusFromErrorType(errorType: ErrorType): number {
    switch (errorType) {
      case ErrorType.VALIDATION:
        return HttpStatus.BAD_REQUEST;
      case ErrorType.AUTHENTICATION:
        return HttpStatus.UNAUTHORIZED;
      case ErrorType.AUTHORIZATION:
        return HttpStatus.FORBIDDEN;
      case ErrorType.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case ErrorType.CONFLICT:
        return HttpStatus.CONFLICT;
      case ErrorType.EXTERNAL_SERVICE:
        return HttpStatus.BAD_GATEWAY;
      case ErrorType.DATABASE:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case ErrorType.RATE_LIMIT:
        return HttpStatus.TOO_MANY_REQUESTS;
      case ErrorType.BAD_REQUEST:
        return HttpStatus.BAD_REQUEST;
      case ErrorType.INTERNAL:
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Creates a descriptive but secure error message.
   * @param error Sanitized error
   * @param errorType Error type
   */
  private createErrorMessage(error: any, errorType: ErrorType): string {
    // Default messages by error type
    const defaultMessages = {
      [ErrorType.VALIDATION]: 'The provided data is not valid',
      [ErrorType.AUTHENTICATION]: 'Authentication error',
      [ErrorType.AUTHORIZATION]: 'You do not have permission to perform this action',
      [ErrorType.NOT_FOUND]: 'The requested resource was not found',
      [ErrorType.CONFLICT]: 'Conflict with the current state of the resource',
      [ErrorType.EXTERNAL_SERVICE]: 'Error in external service',
      [ErrorType.DATABASE]: 'Database error',
      [ErrorType.INTERNAL]: 'Internal server error',
      [ErrorType.RATE_LIMIT]: 'Rate limit exceeded',
      [ErrorType.BAD_REQUEST]: 'Invalid request',
    };

    // If the error has a message, use it; otherwise, use the default message
    const errorMessage = error.message || defaultMessages[errorType] || 'Unknown error';

    // For internal errors, do not expose specific details to the client
    if (errorType === ErrorType.INTERNAL || errorType === ErrorType.DATABASE) {
      return defaultMessages[errorType];
    }

    return errorMessage;
  }

  /**
   * Generates a specific error code to facilitate debugging.
   * @param errorType Error type
   * @param statusCode HTTP code
   */
  private generateErrorCode(errorType: ErrorType, statusCode: number): string {
    // Generate a unique code based on timestamp to identify the specific error instance
    const timestamp = Date.now().toString(36).slice(-4);
    return `${errorType.split('_')[0]}_${statusCode}_${timestamp}`;
  }

  /**
   * Extracts additional details from the error if available.
   * @param error Sanitized error
   */
  private extractErrorDetails(error: any): any {
    // If there is no error or it's not an object, there are no details
    if (!error || typeof error !== 'object') return undefined;

    // Extract relevant fields for debugging
    const details: any = {};

    // Common fields that may be useful
    const relevantFields = ['code', 'errno', 'syscall', 'path', 'address', 'port'];

    for (const field of relevantFields) {
      if (error[field] !== undefined) {
        details[field] = error[field];
      }
    }

    // If there are specific application fields, include them
    if (error.details) {
      details.additionalInfo = error.details;
    }

    return Object.keys(details).length > 0 ? details : undefined;
  }
}

/**
 * Global exception filter. It will catch *any* error that is not
 * handled explicitly by your application (or by other filters).
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * Inject our LoggingReportService to unify the error output format.
   */
  constructor(private readonly loggingReportService: LoggingReportService) { }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Generate a unique ID for the request if it does not exist
    const requestId = request.headers['x-request-id'] ||
      `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;

    // Determine the error type and HTTP code
    let errorType = ErrorType.INTERNAL;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ApiResponse;

    // Classify the error according to its type
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorType = this.mapHttpStatusToErrorType(status);

      // Extract the body that the exception returns
      const nestErrorResponse = exception.getResponse();

      // If it's a validation error, process it specially
      if (status === HttpStatus.BAD_REQUEST &&
        typeof nestErrorResponse === 'object' &&
        'message' in nestErrorResponse &&
        Array.isArray(nestErrorResponse['message'])) {
        errorResponse = this.loggingReportService.validationError(
          nestErrorResponse['message'],
          request.url,
          requestId
        );
      } else {
        // Generate the final response using our service
        errorResponse = this.loggingReportService.loggingError(
          request.url,
          nestErrorResponse,
          requestId,
          errorType
        );
      }
    } else if (exception instanceof Error) {
      // For JavaScript errors, determine the type based on the name
      errorType = this.determineErrorTypeFromError(exception);
      status = this.loggingReportService.getHttpStatusFromErrorType(errorType);

      // Generate the response with the exception message
      errorResponse = this.loggingReportService.loggingError(
        request.url,
        exception,
        requestId,
        errorType
      );
    } else {
      // For something very unusual that is not an HttpException or Error
      errorResponse = this.loggingReportService.loggingError(
        request.url,
        exception,
        requestId,
        ErrorType.INTERNAL
      );
    }

    // Add additional information to the response
    errorResponse.path = request.url;

    // Return the HTTP response with the status and JSON
    response.status(status).json(errorResponse);
  }

  /**
   * Maps an HTTP code to an error type.
   * @param httpStatus HTTP code
   */
  private mapHttpStatusToErrorType(httpStatus: number): ErrorType {
    switch (httpStatus) {
      case HttpStatus.BAD_REQUEST:
        return ErrorType.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ErrorType.AUTHENTICATION;
      case HttpStatus.FORBIDDEN:
        return ErrorType.AUTHORIZATION;
      case HttpStatus.NOT_FOUND:
        return ErrorType.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorType.CONFLICT;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ErrorType.RATE_LIMIT;
      case HttpStatus.BAD_GATEWAY:
      case HttpStatus.GATEWAY_TIMEOUT:
        return ErrorType.EXTERNAL_SERVICE;
      default:
        return ErrorType.INTERNAL;
    }
  }

  /**
   * Determines the error type based on a JavaScript Error instance.
   * @param error JavaScript Error
   */
  private determineErrorTypeFromError(error: Error): ErrorType {
    const errorName = error.name.toLowerCase();
    const errorMessage = error.message.toLowerCase();

    // Classify according to the error name and message
    if (errorName.includes('validation') || errorMessage.includes('validation')) {
      return ErrorType.VALIDATION;
    }

    if (errorName.includes('auth') || errorMessage.includes('auth') ||
      errorMessage.includes('token') || errorMessage.includes('jwt')) {
      return ErrorType.AUTHENTICATION;
    }

    if (errorName.includes('permission') || errorMessage.includes('permission') ||
      errorMessage.includes('forbidden') || errorMessage.includes('access denied')) {
      return ErrorType.AUTHORIZATION;
    }

    if (errorName.includes('notfound') || errorMessage.includes('not found')) {
      return ErrorType.NOT_FOUND;
    }

    if (errorName.includes('conflict') || errorMessage.includes('duplicate') ||
      errorMessage.includes('already exists')) {
      return ErrorType.CONFLICT;
    }

    if (errorName.includes('timeout') || errorMessage.includes('timeout') ||
      errorMessage.includes('external service')) {
      return ErrorType.EXTERNAL_SERVICE;
    }

    if (errorName.includes('db') || errorMessage.includes('database') ||
      errorMessage.includes('sql') || errorMessage.includes('query')) {
      return ErrorType.DATABASE;
    }

    if (errorName.includes('ratelimit') || errorMessage.includes('rate limit') ||
      errorMessage.includes('too many requests')) {
      return ErrorType.RATE_LIMIT;
    }

    return ErrorType.INTERNAL;
  }
}
