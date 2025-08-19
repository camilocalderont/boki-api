import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../dto/clientCreate.dto';
import { ClientRepository } from '../repositories/client.repository';
import { UpdateClientDto } from '../dto/clientUpdate.dto';
import { CompanyEntity } from '../../company/entities/company.entity';
import * as bcrypt from 'bcrypt';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class ClientService extends BaseCrudService<ClientEntity, CreateClientDto, UpdateClientDto> {
    constructor(
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>,
        @InjectRepository(CompanyEntity)
        private readonly companyRepository: Repository<CompanyEntity>,
        @Inject(ClientRepository)
        private readonly clientCustomRepository: ClientRepository
    ) {
        super(clientRepository);
    }

    protected async validateCreate(createClientDto: CreateClientDto): Promise<void> {
        // Validar que la compañía existe
        const existingCompany = await this.companyRepository.findOne({
            where: { Id: createClientDto.CompanyId }
        });

        // const existingClient = await this.clientRepository.findOne({
        //     where: { VcEmail: createClientDto.VcEmail }
        // });

        const existingClientByIdentificationAndCompany = await this.clientRepository.findOne({
            where: { VcIdentificationNumber: createClientDto.VcIdentificationNumber, CompanyId: createClientDto.CompanyId }
        });

        const existingClientByPhoneAndCompany = await this.clientRepository.findOne({
            where: { VcPhone: createClientDto.VcPhone, CompanyId: createClientDto.CompanyId }
        });

        const errors: ApiErrorItem[] = [];

        if (!existingCompany) {
            errors.push({
                code: 'COMPANY_DOES_NOT_EXIST',
                message: 'No existe una compañía con el ID proporcionado.',
                field: 'CompanyId'
            });
        }

        // if (existingClient) {
        //     errors.push({
        //         code: 'EMAIL_ALREADY_EXISTS',
        //         message: 'There is already a customer with this email.',
        //         field: 'VcEmail'
        //     });
        // }

        if (existingClientByPhoneAndCompany) {
            errors.push({
                code: 'PHONE_ALREADY_EXISTS',
                message: 'Ya existe un cliente con este número de teléfono en la compañía.',
                field: 'VcPhone'
            });
        }

        if (existingClientByIdentificationAndCompany) {
            errors.push({
                code: 'IDENTIFICATION_NUMBER_ALREADY_EXISTS',
                message: 'Ya existe un cliente con este número de identificación en la compañía.',
                field: 'VcIdentificationNumber'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Ya existe un cliente con estos datos o la compañía no existe");
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
                        message: 'Ya existe un cliente con estos datos',
                        field: 'client'
                    }],
                    'Ya existe un cliente con estos datos'
                );
            }

            throw new BadRequestException('Ocurrió un error inesperado', error);
        }
    }

    protected async validateUpdate(id: number, updateClientDto: UpdateClientDto): Promise<void> {
        const client = await this.findOne(id);

        const errors: ApiErrorItem[] = [];

        // Validar que la compañía existe si se proporciona CompanyId
        if (updateClientDto.CompanyId && updateClientDto.CompanyId !== client.CompanyId) {
            const existingCompany = await this.companyRepository.findOne({
                where: { Id: updateClientDto.CompanyId }
            });

            if (!existingCompany) {
                errors.push({
                    code: 'COMPANY_DOES_NOT_EXIST',
                    message: 'No existe una compañía con el ID proporcionado.',
                    field: 'CompanyId'
                });
            }
        }

        if (updateClientDto.VcEmail && updateClientDto.VcEmail !== client.VcEmail) {
            const existingClient = await this.clientRepository.findOne({
                where: { VcEmail: updateClientDto.VcEmail }
            });

            if (existingClient) {
                errors.push({
                    code: 'EMAIL_ALREADY_EXISTS',
                    message: 'Ya existe un cliente con este email.',
                    field: 'VcEmail'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Ya existe un cliente con estos datos o la compañía no existe");
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
                        message: 'Ya existe un cliente con estos datos',
                        field: 'client'
                    }],
                    'Ya existe un cliente con estos datos'
                );
            }

            throw new BadRequestException('Ocurrió un error inesperado', error);
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

    async clientByCellphoneForLLM(cellphone: string): Promise<{ id: number; company: number; VcFirstName: string }> {
        try {
            const client = await this.clientCustomRepository.findByPhoneForLLM(cellphone);

            if (!client) {
                throw new ConflictException(
                    [{
                        code: 'NUMBER_DOES_NOT_EXIST',
                        message: `No se encontró cliente con el número de teléfono ${cellphone}`,
                        field: 'cellphone'
                    }],
                    'No se encontró cliente con el número de teléfono'
                );
            }

            return client;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Error buscando cliente por teléfono');
        }
    }
}
