import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../dto/clientCreate.dto';
import { ClientRepository } from '../repositories/client.repository';
import { UpdateClientDto } from '../dto/clientUpdate.dto';
import * as bcrypt from 'bcrypt';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class ClientService extends BaseCrudService<ClientEntity, CreateClientDto, UpdateClientDto> {
    constructor(
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>,
        @Inject(ClientRepository)
        private readonly clientCustomRepository: ClientRepository
    ) {
        super(clientRepository);
    }

    protected async validateCreate(createClientDto: CreateClientDto): Promise<void> {
        // const existingClient = await this.clientRepository.findOne({
        //     where: { VcEmail: createClientDto.VcEmail }
        // });

        const existingClientByIdentification = await this.clientRepository.findOne({
            where: { VcIdentificationNumber: createClientDto.VcIdentificationNumber }
        });

        const existingClientByPhone = await this.clientRepository.findOne({
            where: { VcPhone: createClientDto.VcPhone }
        });

        const errors: ApiErrorItem[] = [];

        // if (existingClient) {
        //     errors.push({
        //         code: 'EMAIL_ALREADY_EXISTS',
        //         message: 'There is already a customer with this email.',
        //         field: 'VcEmail'
        //     });
        // }

        if (existingClientByPhone) {
            errors.push({
                code: 'PHONE_ALREADY_EXISTS',
                message: 'There is already a customer with this phone number.',
                field: 'VcPhone'
            });
        }

        if (existingClientByIdentification) {
            errors.push({
                code: 'IDENTIFICATION_NUMBER_ALREADY_EXISTS',
                message: 'There is already a customer with this identification number.',
                field: 'VcIdentificationNumber'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "There is already a customer with these data");
        }
    }

    async create(createClientDto: CreateClientDto): Promise<ClientEntity> {
        try {
            await this.validateCreate(createClientDto);

            const entity = this.clientRepository.create(createClientDto);
            const savedEntity = await this.clientRepository.save(entity as any);

            await this.afterCreate(savedEntity as ClientEntity);

            return savedEntity;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: '23505',
                        message: 'There is already a customer with these data',
                        field: 'client'
                    }],
                    'There is already a customer with these data'
                );
            }

            throw new BadRequestException('An unexpected error occurred', error);
        }
    }

    protected async validateUpdate(id: number, updateClientDto: UpdateClientDto): Promise<void> {
        const client = await this.findOne(id);

        if (updateClientDto.VcEmail && updateClientDto.VcEmail !== client.VcEmail) {
            const existingClient = await this.clientRepository.findOne({
                where: { VcEmail: updateClientDto.VcEmail }
            });

            const errors: ApiErrorItem[] = [];

            if (existingClient) {
                errors.push({
                    code: 'EMAIL_ALREADY_EXISTS',
                    message: 'There is already a customer with this email.',
                    field: 'VcEmail'
                });
            }

            if (errors.length > 0) {
                throw new ConflictException(errors, "There is already a customer with these data");
            }
        }
    }

    async update(id: number, updateClientDto: UpdateClientDto): Promise<ClientEntity> {
        try {
            return await super.update(id, updateClientDto);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: '23505',
                        message: 'There is already a customer with these data',
                        field: 'client'
                    }],
                    'There is already a customer with these data'
                );
            }

            throw new BadRequestException('An unexpected error occurred', error);
        }
    }

    async clientByCellphone(cellphone: string): Promise<ClientEntity> {
        try {
            const client = await this.clientCustomRepository.findByPhone(cellphone);

            if (!client) {
                throw new ConflictException(
                    [{
                        code: 'NUMBER_DOES_NOT_EXIST',
                        message: `No customer found with the phone number ${cellphone}`,
                        field: 'cellphone'
                    }],
                    'No customer found with the phone number'
                );
            }

            return client;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Error searching for a client by phone');
        }
    }
}
