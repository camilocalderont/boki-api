import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { CreateUsersDto } from '../dto/usersCreate.dto';
import { UsersRepository } from '../repositories/users.repository';
import { UpdateUsersDto } from '../dto/usersUpdate.dto';
import * as bcrypt from 'bcrypt';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class UsersService extends BaseCrudService<UsersEntity, CreateUsersDto, UpdateUsersDto> {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersEntityRepository: Repository<UsersEntity>,
        @Inject(UsersRepository)
        private readonly usersRepository: UsersRepository
    ) {
        super(usersEntityRepository);
    }
    protected async validateCreate(createUsersDto: CreateUsersDto): Promise<void> {
        const errors: ApiErrorItem[] = [];
        
        const existingUser = await this.usersEntityRepository.findOne({
            where: { VcEmail: createUsersDto.VcEmail }
        });

        if (existingUser) {
            errors.push({
                code: 'EMAIL_YA_EXISTE',
                message: 'Ya existe un usuario con este correo electrónico.',
                field: 'VcEmail'
            });
        }

        const existingUserByIdentification = await this.usersEntityRepository.findOne({
            where: { VcIdentificationNumber: createUsersDto.VcIdentificationNumber }
        });

        if (existingUserByIdentification) {
            errors.push({
                code: 'IDENTIFICACION_YA_EXISTE',
                message: 'Ya existe un usuario con este número de identificación.',
                field: 'VcIdentificationNumber'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la creación del usuario");
        }
    }

    protected async prepareCreateData(createUsersDto: CreateUsersDto): Promise<Partial<UsersEntity>> {
        const hashedPassword = await bcrypt.hash(createUsersDto.VcPassword, 10);

        return {
            ...createUsersDto,
            VcPassword: hashedPassword
        };
    }

    async create(createUsersDto: CreateUsersDto): Promise<UsersEntity> {
        try {
            await this.validateCreate(createUsersDto);

            const preparedData = await this.prepareCreateData(createUsersDto);
            const entity = this.usersEntityRepository.create(preparedData as any);
            const savedEntity = await this.usersEntityRepository.save(entity as any);

            await this.afterCreate(savedEntity as UsersEntity);

            return savedEntity;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_USUARIO',
                        message: 'Ya existe un usuario con estos datos',
                        field: 'user'
                    }],
                    'Ya existe un usuario con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_USUARIO',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'user'
                }],
                'Ha ocurrido un error inesperado'
            );
        }
    }

    protected async validateUpdate(id: number, updateUsersDto: UpdateUsersDto): Promise<void> {
        const errors: ApiErrorItem[] = [];
        
        let users: UsersEntity;
        try {
            users = await this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException([{
                    code: 'USUARIO_NO_EXISTE',
                    message: `El usuario con ID ${id} no existe`,
                    field: 'id'
                }], `El usuario con ID ${id} no existe`);
            }
            throw error;
        }

        if (updateUsersDto.VcEmail && updateUsersDto.VcEmail !== users.VcEmail) {
            const existingUser = await this.usersEntityRepository.findOne({
                where: { VcEmail: updateUsersDto.VcEmail }
            });

            if (existingUser) {
                errors.push({
                    code: 'EMAIL_YA_EXISTE',
                    message: 'Ya existe un usuario con este correo electrónico.',
                    field: 'VcEmail'
                });
            }
        }
        
        if (updateUsersDto.VcIdentificationNumber && 
            updateUsersDto.VcIdentificationNumber !== users.VcIdentificationNumber) {
            const existingId = await this.usersEntityRepository.findOne({
                where: { VcIdentificationNumber: updateUsersDto.VcIdentificationNumber }
            });

            if (existingId) {
                errors.push({
                    code: 'IDENTIFICACION_YA_EXISTE',
                    message: 'Ya existe un usuario con este número de identificación.',
                    field: 'VcIdentificationNumber'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la actualización del usuario");
        }
    }

    protected async prepareUpdateData(entity: UsersEntity, updateUsersDto: UpdateUsersDto): Promise<Partial<UsersEntity>> {
        const preparedData = { ...updateUsersDto };

        if (preparedData.VcPassword) {
            preparedData.VcPassword = await bcrypt.hash(preparedData.VcPassword, 10);
        }

        return preparedData;
    }

    async update(id: number, updateUsersDto: UpdateUsersDto): Promise<UsersEntity> {
        try {
            await this.validateUpdate(id, updateUsersDto);
            return await super.update(id, updateUsersDto);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_USUARIO',
                        message: 'Ya existe un usuario con estos datos',
                        field: 'user'
                    }],
                    'Ya existe un usuario con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_ACTUALIZACION_USUARIO',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'user'
                }],
                'Ha ocurrido un error inesperado'
            );
        }
    }
}
