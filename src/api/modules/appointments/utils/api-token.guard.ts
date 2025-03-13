import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { config } from '../../../config';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['x-api-token'];

    if (!token || token !== config.JWT_SECRET) {
      throw new UnauthorizedException('Invalid API token');
    }

    return true;
  }
}
