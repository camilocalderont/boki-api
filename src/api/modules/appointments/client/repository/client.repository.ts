import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../schemas/create-client.schema';

@Injectable()
export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  async findAll(): Promise<ClientEntity[]> {
    return await this.clientRepository.find();
  }

  async findOne(id: number): Promise<ClientEntity> {
    return await this.clientRepository.findOne({ where: { Id: id } });
  }

  async findByEmail(email: string): Promise<ClientEntity> {
    return await this.clientRepository.findOne({ where: { VcEmail: email } });
  }

  async update(id: number, updateClientDto: Partial<CreateClientDto>): Promise<ClientEntity> {
    await this.clientRepository.update(id, updateClientDto);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
