import { SetMetadata } from '@nestjs/common';

// Clave para identificar rutas públicas en los metadatos
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorador para marcar rutas como públicas (sin autenticación JWT requerida)
 * Uso: @Public() en el controlador o método específico
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);