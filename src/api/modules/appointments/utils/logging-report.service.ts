import { Injectable, Logger, HttpStatus } from '@nestjs/common';

@Injectable()
export class LoggingReportService {
  private readonly logger = new Logger(LoggingReportService.name);

  /**
   * Retorna una respuesta de éxito genérica (por ejemplo, para procesar JSON correctamente).
   */
  logging(apiName: string) {
    const message = 'JSON data successfully processed.';
    this.logger.log(message, apiName);
    return {
      apiStatus: true,
      data: null,
      statusType: 'SUCCESS',
      // Puedes usar códigos personalizados o los estándares HTTP, aquí se muestra un ejemplo:
      statusCode: 200044,  
      statusMessage: message,
    };
  }

  /**
   * Retorna una respuesta de error, similar al try-catch de Python.
   */
  loggingError(apiName: string, error: any) {
    const errMessage = `Error: ${error.toString()}`;
    // Aquí usamos un código de error personalizado (por ejemplo, 500201)
    const statusCode = 500201;
    this.logger.error(`${statusCode} | ${errMessage}`, error, apiName);
    return {
      apiStatus: false,
      data: null,
      statusType: 'ERROR',
      statusCode: statusCode,
      statusMessage: errMessage,
    };
  }

  /**
   * Retorna una respuesta con datos obtenidos exitosamente.
   */
  loggingData(resultData: any, apiName: string) {
    const message = 'Information delivered correctly';
    this.logger.log(message, apiName);
    return {
      apiStatus: true,
      data: resultData,
      statusType: 'SUCCESS',
      statusCode: 200044,
      statusMessage: message,
    };
  }

  /**
   * Retorna una respuesta indicando que los datos se han eliminado exitosamente.
   */
  deletedData(apiName: string) {
    const message = 'Data deleted successfully';
    this.logger.log(message, apiName);
    return {
      apiStatus: true,
      data: null,
      statusType: 'SUCCESS',
      statusCode: 200044,
      statusMessage: message,
    };
  }
}
