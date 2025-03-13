import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ClientRepository } from '../repository/client.repository';
import { CreateClientDto } from '../schemas/create-client.schema';
import { ClientEntity } from '../entities/client.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
    const existingClient = await this.clientRepository.findByEmail(createClientDto.VcEmail);
    if (existingClient) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createClientDto.VcPassword, 10);
    const clientWithHashedPassword = {
      ...createClientDto,
      VcPassword: hashedPassword,
    };
    return await this.clientRepository.create(clientWithHashedPassword);
  }

  async findAll(): Promise<ClientEntity[]> {
    return await this.clientRepository.findAll();
  }

  async findOne(id: number): Promise<ClientEntity> {
    const client = await this.clientRepository.findOne(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async findByEmail(email: string): Promise<ClientEntity> {
    const client = await this.clientRepository.findByEmail(email);
    if (!client) {
      throw new NotFoundException(`Client with email ${email} not found`);
    }
    return client;
  }

  async validateClient(email: string, password: string): Promise<ClientEntity> {
    const client = await this.clientRepository.findByEmail(email);
    if (!client) {
      throw new NotFoundException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, client.VcPassword);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }

    return client;
  }

  async update(id: number, updateClientDto: Partial<CreateClientDto>): Promise<ClientEntity> {
    const client = await this.findOne(id);
    
    if (updateClientDto.VcEmail && updateClientDto.VcEmail !== client.VcEmail) {
      const existingClient = await this.clientRepository.findByEmail(updateClientDto.VcEmail);
      if (existingClient) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateClientDto.VcPassword) {
      updateClientDto.VcPassword = await bcrypt.hash(updateClientDto.VcPassword, 10);
    }

    return await this.clientRepository.update(id, updateClientDto);
  }

  async delete(id: number): Promise<void> {
    const client = await this.findOne(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    await this.clientRepository.delete(id);
  }
}
