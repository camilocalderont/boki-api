import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { API_KEY_ENDPOINTS } from '../decorators/allow-api-key.decorator';
import * as jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
  authType?: 'jwt' | 'apikey';
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtSecret = process.env.JWT_SECRET;
  private readonly apiKey = process.env.N8N_API_KEY;

  constructor(private reflector: Reflector) {} // ✅ SIN EL ?

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { url, method } = request;

    // 1. Verificar si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // 2. Verificar rutas públicas hardcodeadas
    const publicRoutes = [
      { method: 'POST', path: '/api/v1/users' },
      { method: 'POST', path: '/api/v1/users/login' },
      { method: 'POST', path: '/api/v1/semantic-search' },
    ];

    const isPublicRoute = publicRoutes.some(
      (route) => method === route.method && url.includes(route.path),
    );

    if (isPublicRoute) {
      return true;
    }

    // 3. Verificar si el endpoint permite API Key
    const allowApiKey = this.reflector.getAllAndOverride<boolean>(
      API_KEY_ENDPOINTS,
      [context.getHandler(), context.getClass()],
    );

    // 4. Si permite API Key, verificar si viene en el header
    if (allowApiKey) {
      const apiKeyFromHeader = this.extractApiKeyFromHeader(request);
      
      // Si viene API Key, validarla
      if (apiKeyFromHeader) {
        if (apiKeyFromHeader === this.apiKey) {
          // API Key válida - PERMITIR ACCESO
          request.authType = 'apikey';
          console.log('✅ Acceso permitido con API Key');
          return true;
        } else {
          // ❌ API Key inválida
          throw new UnauthorizedException(
            [
              {
                code: 'API_KEY_INVALIDA',
                message: 'La API Key proporcionada no es válida.',
                field: 'x-api-key',
              },
            ],
            'API Key inválida',
          );
        }
      }
      
    }

    // 5. Validación JWT para rutas protegidas
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        [
          {
            code: 'TOKEN_NO_PROPORCIONADO',
            message:
              'Token de acceso requerido. Incluye el token en el header Authorization o una API Key válida en X-API-Key.',
            field: 'authorization',
          },
        ],
        'Token de acceso requerido',
      );
    }

    try {
      const payload: any = jwt.verify(token, this.jwtSecret);

      request.user = {
        userId: payload.userId,
        email: payload.email,
      };
      request.authType = 'jwt';

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          [
            {
              code: 'TOKEN_EXPIRADO',
              message: 'El token de acceso ha expirado. Inicia sesión nuevamente.',
              field: 'authorization',
            },
          ],
          'Token expirado',
        );
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          [
            {
              code: 'TOKEN_INVALIDO',
              message: 'El token de acceso no es válido.',
              field: 'authorization',
            },
          ],
          'Token inválido',
        );
      }

      throw new UnauthorizedException(
        [
          {
            code: 'ERROR_AUTENTICACION',
            message: 'Error en la verificación del token de acceso.',
            field: 'authorization',
          },
        ],
        'Error de autenticación',
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    return request.headers['x-api-key'] as string;
  }
}