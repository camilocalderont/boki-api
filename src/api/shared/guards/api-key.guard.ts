import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { API_KEY_ENDPOINTS } from '../decorators/allow-api-key.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKey = process.env.N8N_API_KEY;

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Verificar si el endpoint permite API Key
    const allowApiKey = this.reflector.getAllAndOverride<boolean>(
      API_KEY_ENDPOINTS,
      [context.getHandler(), context.getClass()],
    );

    if (!allowApiKey) {
      return false;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      throw new UnauthorizedException([
        {
          code: 'API_KEY_NO_PROPORCIONADA',
          message: 'API Key requerida. Incluye la key en el header X-API-Key.',
          field: 'x-api-key',
        },
      ], 'API Key requerida');
    }

    if (apiKey !== this.apiKey) {
      throw new UnauthorizedException([
        {
          code: 'API_KEY_INVALIDA',
          message: 'La API Key proporcionada no es válida.',
          field: 'x-api-key',
        },
      ], 'API Key inválida');
    }

    return true;
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    return request.headers['x-api-key'] as string;
  }
}