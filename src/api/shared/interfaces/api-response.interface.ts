// src/api/shared/interfaces/api-response.interface.ts

// Interfaz para errores individuales
export interface ApiErrorItem {
    code: string;
    message: string;
    field: string;
}

// Respuesta base (propiedades comunes)
export interface ApiResponseBase {
    status: 'success' | 'error';
    message: string;
}

// Respuesta desde los controladores con data y mensaje
export interface ApiControllerResponse<T = any> {
    message: string;
    data: T;
}

// Respuesta exitosa (genérica para aceptar cualquier tipo de datos)
export interface ApiSuccessResponse<T = any> extends ApiResponseBase {
    status: 'success';
    data: T;
}

// Respuesta de error
export interface ApiErrorResponse extends ApiResponseBase {
    status: 'error';
    errors?: ApiErrorItem[];
}

// Respuesta de error
export interface ApiServiceErrorResponse {
    message: ApiErrorItem[];
    error: string;
}

  // Tipo que une ambas respuestas (útil para funciones que pueden devolver éxito o error)
  export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;