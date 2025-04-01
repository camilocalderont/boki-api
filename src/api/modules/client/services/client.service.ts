import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../dto/clientCreate.dto';
import * as bcrypt from 'bcrypt';
import { BaseCrudService } from '../../../shared/services/crud.services';

@Injectable()
export class ClientService extends BaseCrudService<ClientEntity> {
    constructor(
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>
    ) {
        super(clientRepository);
    }

    async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
        try {
            if (!createClientDto.VcPassword) {
                throw new BadRequestException('Password is required');
            }

            const existingClient = await this.clientRepository.findOne({
                where: { VcEmail: createClientDto.VcEmail }
            });

            if (existingClient) {
                throw new ConflictException('Email already exists in the system');
            }

            const hashedPassword = await bcrypt.hash(createClientDto.VcPassword, 10);
            
            const clientData = {
                ...createClientDto,
                VcPassword: hashedPassword
            };
            
            return await super.create(clientData);
        } catch (error) {
            if (error instanceof BadRequestException || 
                error instanceof ConflictException) {
                throw error;
            }
            
            if (error.code === '23505') { 
                throw new ConflictException('A client with this data already exists');
            }
            
            console.error('Error in create:', error);
            throw error;
        }
    }

    async update(id: number, updateClientDto: Partial<CreateClientDto>): Promise<ClientEntity> {
        try {
            const client = await this.findOne(id);

            if (updateClientDto.VcEmail && updateClientDto.VcEmail !== client.VcEmail) {
                const existingClient = await this.clientRepository.findOne({
                    where: { VcEmail: updateClientDto.VcEmail }
                });

                if (existingClient) {
                    throw new ConflictException('Email already exists in the system');
                }
            }

            if (updateClientDto.VcPassword) {
                updateClientDto.VcPassword = await bcrypt.hash(updateClientDto.VcPassword, 10);
            }

            Object.assign(client, updateClientDto);
            return await this.clientRepository.save(client);
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }
    }
}
