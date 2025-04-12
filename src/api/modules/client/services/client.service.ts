import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../dto/clientCreate.dto';
import { UpdateClientDto } from '../dto/clientUpdate.dto';
import * as bcrypt from 'bcrypt';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class ClientService extends BaseCrudService<ClientEntity, CreateClientDto, UpdateClientDto> {
    constructor(
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>
    ) {
        super(clientRepository);
    }

    protected async validateCreate(createClientDto: CreateClientDto): Promise<void> {
        const existingClient = await this.clientRepository.findOne({
            where: { VcEmail: createClientDto.VcEmail }
        });

        const existingClientByIdentification = await this.clientRepository.findOne({
            where: { VcIdentificationNumber: createClientDto.VcIdentificationNumber }
        });

        const errors: ApiErrorItem[] = [];

        if (existingClient) {
            errors.push({
                code: 'EMAIL_ALREADY_EXISTS',
                message: 'Ya existe un cliente con este email',
                field: 'VcEmail'
            });
        }

        if (existingClientByIdentification) {
            errors.push({
                code: 'IDENTIFICATION_NUMBER_ALREADY_EXISTS',
                message: 'Ya existe un cliente con este número de identificación',
                field: 'VcIdentificationNumber'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Ya existe un cliente con estos datos");
        }

    }

    protected async prepareCreateData(createClientDto: CreateClientDto): Promise<Partial<ClientEntity>> {
        const hashedPassword = await bcrypt.hash(createClientDto.VcPassword, 10);

        return {
            ...createClientDto,
            VcPassword: hashedPassword
        };
    }

    async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
        try {
            await this.validateCreate(createClientDto);

            const preparedData = await this.prepareCreateData(createClientDto);
            const entity = this.clientRepository.create(preparedData as any);
            const savedEntity = await this.clientRepository.save(entity as any);

            await this.afterCreate(savedEntity as ClientEntity);

            return savedEntity;
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException('Ya existe un cliente con estos datos');
            }

            console.error('Error in create:', error);
            throw error;
        }
    }

    protected async validateUpdate(id: number, updateClientDto: UpdateClientDto): Promise<void> {
        try {
            const client = await this.findOne(id);

            if (updateClientDto.VcEmail && updateClientDto.VcEmail !== client.VcEmail) {
                const existingClient = await this.clientRepository.findOne({
                    where: { VcEmail: updateClientDto.VcEmail }
                });

                if (existingClient) {
                    throw new ConflictException('Ya existe un cliente con este email');
                }
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Error validating client with ID ${id}: ${error.message}`);
        }
    }

    protected async prepareUpdateData(entity: ClientEntity, updateClientDto: UpdateClientDto): Promise<Partial<ClientEntity>> {
        const preparedData = { ...updateClientDto };

        if (preparedData.VcPassword) {
            preparedData.VcPassword = await bcrypt.hash(preparedData.VcPassword, 10);
        }

        return preparedData;
    }

    async update(id: number, updateClientDto: UpdateClientDto): Promise<ClientEntity> {
        try {
            return await super.update(id, updateClientDto);
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException('Ya existe un cliente con estos datos');
            }

            console.error('Error in update:', error);
            throw error;
        }
    }
}
