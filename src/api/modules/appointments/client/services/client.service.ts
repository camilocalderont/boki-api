import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../schemas/create-client.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>
    ) {}

    async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
        const existingClient = await this.clientRepository.findOne({
            where: { VcEmail: createClientDto.VcEmail }
        });

        if (existingClient) {
            throw new ConflictException('El email ya existe en el sistema');
        }

        const hashedPassword = await bcrypt.hash(createClientDto.VcPassword, 10);
        const client = this.clientRepository.create({
            ...createClientDto,
            VcPassword: hashedPassword
        });

        return this.clientRepository.save(client);
    }

    async findAll(): Promise<ClientEntity[]> {
        return this.clientRepository.find();
    }

    async findOne(Id: number): Promise<ClientEntity> {
        const client = await this.clientRepository.findOne({
            where: { Id }
        });

        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        return client;
    }

    async findByEmail(email: string): Promise<ClientEntity> {
        const client = await this.clientRepository.findOne({
            where: { VcEmail: email }
        });

        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        return client;
    }

    async validateClient(email: string, password: string): Promise<ClientEntity> {
        const client = await this.clientRepository.findOne({
            where: { VcEmail: email }
        });

        if (!client) {
            throw new NotFoundException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, client.VcPassword);
        if (!isPasswordValid) {
            throw new NotFoundException('Credenciales inválidas');
        }

        return client;
    }

    async update(id: number, updateClientDto: Partial<CreateClientDto>): Promise<ClientEntity> {
        const client = await this.findOne(id);

        if (updateClientDto.VcEmail && updateClientDto.VcEmail !== client.VcEmail) {
            const existingClient = await this.clientRepository.findOne({
                where: { VcEmail: updateClientDto.VcEmail }
            });

            if (existingClient) {
                throw new ConflictException('El email ya existe en el sistema');
            }
        }

        if (updateClientDto.VcPassword) {
            updateClientDto.VcPassword = await bcrypt.hash(updateClientDto.VcPassword, 10);
        }

        Object.assign(client, updateClientDto);
        return this.clientRepository.save(client);
    }

    async remove(id: number): Promise<void> {
        const client = await this.findOne(id);
        await this.clientRepository.remove(client);
    }
}
