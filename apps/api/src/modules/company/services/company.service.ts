import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/companyCreate.dto';
import { UpdateCompanyDto } from '../dto/companyUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class CompanyService extends BaseCrudService<CompanyEntity, CreateCompanyDto, UpdateCompanyDto> {
    constructor(
        @InjectRepository(CompanyEntity)
        private readonly companyRepository: Repository<CompanyEntity>
    ) {
        super(companyRepository);
    }

    protected async validateCreate(createCompanyDto: CreateCompanyDto): Promise<void> {
        const existingCompany = await this.companyRepository.findOne({
            where: { VcPrincipalEmail: createCompanyDto.VcPrincipalEmail }
        });

        const errors: ApiErrorItem[] = [];

        if (existingCompany) {
            errors.push({
                code: 'Ya_existe_empresa',
                message: 'Ya existe una empresa con estos datos',
                field: 'company'
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

            if (errors.length > 0) {
                throw new ConflictException(errors, "Error en la actualización de empresa");
            }
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
