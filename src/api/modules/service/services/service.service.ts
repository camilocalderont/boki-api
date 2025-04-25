import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/serviceCreate.dto';
import { UpdateServiceDto } from '../dto/serviceUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class ServiceService extends BaseCrudService<ServiceEntity, CreateServiceDto, UpdateServiceDto> {
    constructor(
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>
    ) {
        super(serviceRepository);
    }

    protected async validateCreate(createServiceDto: CreateServiceDto): Promise<void> {
        const errors: ApiErrorItem[] = [];
        const existingService = await this.serviceRepository.findOne({
            where: { VcName: createServiceDto.VcName }
        });

        if (existingService) {
            errors.push({
                code: 'NOMBRE_YA_EXISTE',
                message: 'Ya existe un servicio con este nombre.',
                field: 'VcName'
            });
        }

        const existingCompany = await this.serviceRepository.findOne({
            where: { CompanyId: createServiceDto.CompanyId }
        });
        if (!existingCompany) {
            errors.push({
                code: 'EMPRESA_NO_EXISTE',
                message: 'La empresa no existe.',
                field: 'CompanyId'
            });
        }

        const existingCategory = await this.serviceRepository.findOne({
            where: { CategoryId: createServiceDto.CategoryId }
        });
        if (!existingCategory) {
            errors.push({
                code: 'CATEGORIA_NO_EXISTE',
                message: 'La categoría no existe.',
                field: 'CategoryId'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la creación del servicio");
        }
    }

    async create(createServiceDto: CreateServiceDto): Promise<ServiceEntity> {
        try {
            await this.validateCreate(createServiceDto);
            const entity = this.serviceRepository.create(createServiceDto);
            const savedEntity = await this.serviceRepository.save(entity);
            await this.afterCreate(savedEntity);
            return savedEntity;
            
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }
           
            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_SERVICIO',
                        message: 'Ya existe un servicio con estos datos',
                        field: 'service'
                    }],
                    'Ya existe un servicio con estos datos'
                );
            }

            throw new BadRequestException('Ha ocurrido un error inesperado', error);
        }
    }


    protected async validateUpdate(id: number, updateServiceDto: UpdateServiceDto): Promise<void> {
        const errors: ApiErrorItem[] = [];
        
        let service: ServiceEntity;
        try {
            service = await this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException([
                    {
                        code: 'SERVICIO_NO_EXISTE',
                        message: `El servicio con ID ${id} no existe`,
                        field: 'id'
                    }
                ], `El servicio con ID ${id} no existe`);
            }
            throw error;
        }
        
        if (updateServiceDto.VcName && updateServiceDto.VcName !== service.VcName) {
            const existingService = await this.serviceRepository.findOne({
                where: { VcName: updateServiceDto.VcName }
            });
            if (existingService) {
                errors.push({
                    code: 'NOMBRE_YA_EXISTE',
                    message: 'Ya existe un servicio con este nombre.',
                    field: 'VcName'
                });
            }
        }

        if (updateServiceDto.CompanyId !== undefined) {
            const existingCompany = await this.serviceRepository.findOne({
                where: { CompanyId: updateServiceDto.CompanyId }
            });
            if (!existingCompany) {
                errors.push({
                    code: 'EMPRESA_NO_EXISTE',
                    message: 'La empresa no existe.',
                    field: 'CompanyId'
                });
            }
        }

        if (updateServiceDto.CategoryId !== undefined) {
            const existingCategory = await this.serviceRepository.findOne({
                where: { CategoryId: updateServiceDto.CategoryId }
            });
            if (!existingCategory) {
                errors.push({
                    code: 'CATEGORIA_NO_EXISTE',
                    message: 'La categoría no existe.',
                    field: 'CategoryId'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la actualización del servicio");
        }
    }

    async update(id: number, updateServiceDto: UpdateServiceDto): Promise<ServiceEntity> {
        try {
            await this.validateUpdate(id, updateServiceDto);
            const existingEntity = await this.serviceRepository.findOne({ where: { Id: id } });
            
            Object.assign(existingEntity, updateServiceDto);
            const updatedEntity = await this.serviceRepository.save(existingEntity);
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
                        code: 'YA_EXISTE_SERVICIO',
                        message: 'Ya existe un servicio con estos datos',
                        field: 'service'
                    }],
                    'Ya existe un servicio con estos datos'
                );
            }
            
            throw new BadRequestException([
                {
                    code: 'ERROR_ACTUALIZAR',
                    message: 'Ha ocurrido un error al actualizar el servicio',
                    field: 'unknown'
                }
            ], 'Ha ocurrido un error inesperado');
        }
    }

    async findByCompany(companyId: number): Promise<ServiceEntity[]> {
        return this.serviceRepository.find({
            where: { CompanyId: companyId },
            relations: ['Category']
        });
    }

    async findByCategory(categoryId: number): Promise<ServiceEntity[]> {
        return this.serviceRepository.find({
            where: { CategoryId: categoryId },
            relations: ['Company']
        });
    }
}
