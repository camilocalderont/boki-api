// src/api/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientService } from '../client/services/client.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientService: ClientService,
    private readonly jwtService: JwtService,
  ) {}

  async validateClient(email: string, password: string) {
    const client = await this.clientService.findByEmail(email);
    if (!client) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, client.VcPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return client;
  }

  async login(email: string, password: string) {
    const client = await this.validateClient(email, password);
    const payload = { sub: client.Id, email: client.VcEmail };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      client: {
        id: client.Id,
        email: client.VcEmail,
        firstName: client.VcFirstName,
        lastName: client.VcFirstLastName,
      },
    };
  }
}
