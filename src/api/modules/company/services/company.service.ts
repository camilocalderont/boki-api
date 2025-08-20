import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/companyCreate.dto';
import { UpdateCompanyDto } from '../dto/companyUpdate.dto';
import { UsersEntity } from '../../users/entities/users.entity';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class CompanyService extends BaseCrudService<CompanyEntity, CreateCompanyDto, UpdateCompanyDto> {
    constructor(
        @InjectRepository(CompanyEntity)
        private readonly companyRepository: Repository<CompanyEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>
    ) {
        super(companyRepository);
    }

    protected async validateCreate(createCompanyDto: CreateCompanyDto): Promise<void> {
        const errors: ApiErrorItem[] = [];

        // Validación existente: verificar email único
        const existingCompany = await this.companyRepository.findOne({
            where: { VcPrincipalEmail: createCompanyDto.VcPrincipalEmail }
        });

        if (existingCompany) {
            errors.push({
                code: 'Ya_existe_empresa',
                message: 'Ya existe una empresa con estos datos',
                field: 'company'
            });
        }

        // validación: verificar que el UserId existe
        const userExists = await this.usersRepository.findOne({
            where: { Id: createCompanyDto.UserId }
        });

        if (!userExists) {
            errors.push({
                code: 'USUARIO_NO_EXISTE',
                message: `El usuario con ID ${createCompanyDto.UserId} no existe`,
                field: 'UserId'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la creación de empresa");
        }
    }

    async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
        try {
            await this.validateCreate(createCompanyDto);
            const entity = this.companyRepository.create(createCompanyDto);
            const savedEntity = await this.companyRepository.save(entity);
            await this.afterCreate(savedEntity);
            return savedEntity;

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }
            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'Ya_existe_empresa',
                        message: 'Ya existe una empresa con estos datos',
                        field: 'company'
                    }],
                    'Ya existe una empresa con estos datos'
                );
            }

            throw new BadRequestException('Ha ocurrido un error inesperado', error);
        }
    }

    protected async validateUpdate(id: number, updateCompanyDto: UpdateCompanyDto): Promise<void> {
        const errors: ApiErrorItem[] = [];
        let company: CompanyEntity;
        
        try {
            company = await this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException([
                    {
                        code: 'EMPRESA_NO_EXISTE',
                        message: `La empresa con ID ${id} no existe`,
                        field: 'id'
                    }
                ], `La empresa con ID ${id} no existe`);
            }
            throw error;
        }

        // Validación existente: verificar email único si se está cambiando
        if (updateCompanyDto.VcPrincipalEmail && updateCompanyDto.VcPrincipalEmail !== company.VcPrincipalEmail) {
            const existingCompany = await this.companyRepository.findOne({
                where: { VcPrincipalEmail: updateCompanyDto.VcPrincipalEmail }
            });

            if (existingCompany) {
                errors.push({
                    code: 'Ya_existe_empresa',
                    message: 'Ya existe una empresa con estos datos',
                    field: 'company'
                });
            }
        }

        // validación: verificar que el UserId existe si se está cambiando
        if (updateCompanyDto.UserId && updateCompanyDto.UserId !== company.UserId) {
            const userExists = await this.usersRepository.findOne({
                where: { Id: updateCompanyDto.UserId }
            });

            if (!userExists) {
                errors.push({
                    code: 'USUARIO_NO_EXISTE',
                    message: `El usuario con ID ${updateCompanyDto.UserId} no existe`,
                    field: 'UserId'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la actualización de empresa");
        }
    }

    async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<CompanyEntity> {
        try {
            await this.validateUpdate(id, updateCompanyDto);
            const existingEntity = await this.companyRepository.findOne({ where: { Id: id } });
            
            Object.assign(existingEntity, updateCompanyDto);
            const updatedEntity = await this.companyRepository.save(existingEntity);
            return updatedEntity;
        } catch (error) {
            if (error instanceof NotFoundException || 
                error instanceof BadRequestException || 
                error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'Ya_existe_empresa',
                        message: 'Ya existe una empresa con estos datos',
                        field: 'company'
                    }],
                    'Ya existe una empresa con estos datos'
                );
            }

            throw new BadRequestException([
                {
                    code: 'ERROR_ACTUALIZAR',
                    message: 'Ha ocurrido un error al actualizar la empresa',
                    field: 'unknown'
                }
            ], 'Ha ocurrido un error inesperado');
        }
    }
}