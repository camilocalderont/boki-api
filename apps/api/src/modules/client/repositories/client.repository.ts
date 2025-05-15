import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../entities/client.entity';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async findByPhone(phone: string): Promise<ClientEntity> {
    try {
      const client = await this.clientRepository.findOne({ 
        where: { VcPhone: phone } 
      });
      return client;
    } catch (error) {
      throw error;
    }
  }
}
