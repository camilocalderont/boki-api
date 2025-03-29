import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
    ) {
        console.log('ClientService inicializado, clientRepository:', !!this.clientRepository);
    }

    async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
        console.log('ClientService - create llamado, datos recibidos:', JSON.stringify(createClientDto));
        try {
            // Validar que la contraseña existe
            if (!createClientDto.VcPassword) {
                throw new BadRequestException('La contraseña es requerida');
            }

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

            return await this.clientRepository.save(client);
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async findAll(): Promise<ClientEntity[]> {
        try {
            return await this.clientRepository.find();
        } catch (error) {
            console.error('Error en findAll:', error);
            throw error;
        }
    }

    async findOne(Id: number): Promise<ClientEntity> {
        try {
            const client = await this.clientRepository.findOne({
                where: { Id }
            });

            if (!client) {
                throw new NotFoundException('Cliente no encontrado');
            }

            return client;
        } catch (error) {
            console.error('Error en findOne:', error);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<ClientEntity> {
        try {
            const client = await this.clientRepository.findOne({
                where: { VcEmail: email }
            });

            if (!client) {
                throw new NotFoundException('Cliente no encontrado');
            }

            return client;
        } catch (error) {
            console.error('Error en findByEmail:', error);
            throw error;
        }
    }

    async validateClient(email: string, password: string): Promise<ClientEntity> {
        try {
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
        } catch (error) {
            console.error('Error en validateClient:', error);
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
                    throw new ConflictException('El email ya existe en el sistema');
                }
            }

            if (updateClientDto.VcPassword) {
                updateClientDto.VcPassword = await bcrypt.hash(updateClientDto.VcPassword, 10);
            }

            Object.assign(client, updateClientDto);
            return await this.clientRepository.save(client);
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const client = await this.findOne(id);
            await this.clientRepository.remove(client);
        } catch (error) {
            console.error('Error en remove:', error);
            throw error;
        }
    }
}
