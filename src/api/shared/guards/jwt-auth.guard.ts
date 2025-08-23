import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import * as jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {

  private readonly jwtSecret = process.env.JWT_SECRET;

  constructor(
    private reflector?: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar si la ruta está marcada como pública 
    let isPublic = false;

    if (this.reflector) {
      try {
        isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
      } catch (error) {
        console.log('Error usando Reflector, usando hardcode');
      }
    }

    if (isPublic) {
      return true;
    }

    // Verificar si es una ruta específica que debe ser pública
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { url, method } = request;

    const publicRoutes = [
      { method: 'POST', path: '/api/v1/users' },
      { method: 'POST', path: '/api/v1/users/login' },
    ];

    const isPublicRoute = publicRoutes.some(
      route => method === route.method && url.includes(route.path)
    );

    if (isPublicRoute) {
      return true;
    }

    // Validación JWT para rutas protegidas
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException([{
        code: 'TOKEN_NO_PROPORCIONADO',
        message: 'Token de acceso requerido. Incluye el token en el header Authorization.',
        field: 'authorization'
      }], 'Token de acceso requerido');
    }

    try {
      let payload: any;

      // usar verificación manual para asegurar el mismo secret
      payload = jwt.verify(token, this.jwtSecret);

      request.user = {
        userId: payload.userId,
        email: payload.email,
      };

      return true;

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException([{
          code: 'TOKEN_EXPIRADO',
          message: 'El token de acceso ha expirado. Inicia sesión nuevamente.',
          field: 'authorization'
        }], 'Token expirado');
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException([{
          code: 'TOKEN_INVALIDO',
          message: 'El token de acceso no es válido.',
          field: 'authorization'
        }], 'Token inválido');
      }

      throw new UnauthorizedException([{
        code: 'ERROR_AUTENTICACION',
        message: 'Error en la verificación del token de acceso.',
        field: 'authorization'
      }], 'Error de autenticación');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}