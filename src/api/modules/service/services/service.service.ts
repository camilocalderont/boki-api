import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ServiceEntity } from '../entities/service.entity';
import { ServiceStageEntity } from '../entities/serviceStage.entity';
import { CreateServiceDto } from '../dto/serviceCreate.dto';
import { UpdateServiceDto } from '../dto/serviceUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';
import { ServiceStageService } from './serviceStage.service';

@Injectable()
export class ServiceService extends BaseCrudService<ServiceEntity, CreateServiceDto, UpdateServiceDto> {
    constructor(
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @Inject(ServiceStageService)
        private readonly serviceStageService: ServiceStageService
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
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.validateCreate(createServiceDto);
            const { ServiceStages, ...serviceData } = createServiceDto;
            const entity = this.serviceRepository.create(serviceData);
            const savedEntity = await queryRunner.manager.save(entity);

            if (ServiceStages && Array.isArray(ServiceStages) && ServiceStages.length > 0) {
                const serviceStageEntities = await this.serviceStageService.createMany(
                    queryRunner,
                    savedEntity.Id,
                    ServiceStages
                );
                savedEntity.ServiceStages = serviceStageEntities;
            }

            await queryRunner.commitTransaction();
            await this.afterCreate(savedEntity);
            return savedEntity;

        } catch (error) {
            await queryRunner.rollbackTransaction();

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

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_SERVICIO',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'service'
                }],
                'Ha ocurrido un error inesperado'
            );
        } finally {
            await queryRunner.release();
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
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.validateUpdate(id, updateServiceDto);
            const { ServiceStages, ...serviceData } = updateServiceDto;
            const existingEntity = await this.serviceRepository.findOne({
                where: { Id: id },
                relations: ['ServiceStages']
            });

            if (!existingEntity) {
                throw new NotFoundException([
                    {
                        code: 'SERVICIO_NO_EXISTE',
                        message: `El servicio con ID ${id} no existe`,
                        field: 'id'
                    }
                ], `El servicio con ID ${id} no existe`);
            }

            Object.assign(existingEntity, serviceData);
            const updatedEntity = await queryRunner.manager.save(existingEntity);

            if (ServiceStages && Array.isArray(ServiceStages) && ServiceStages.length > 0) {
                if (existingEntity.ServiceStages && existingEntity.ServiceStages.length > 0) {
                    await queryRunner.manager.delete('ServiceStage', { ServiceId: id });
                }

                const createDtos = ServiceStages.map(stage => ({
                    ISequence: stage.ISequence,
                    IDurationMinutes: stage.IDurationMinutes,
                    VcDescription: stage.VcDescription,
                    BIsProfessionalBussy: stage.BIsProfessionalBussy,
                    BIsActive: stage.BIsActive !== undefined ? stage.BIsActive : true
                }));
                
                const serviceStageEntities = await this.serviceStageService.createMany(
                    queryRunner,
                    updatedEntity.Id,
                    createDtos
                );
                updatedEntity.ServiceStages = serviceStageEntities;
            }

            await queryRunner.commitTransaction();
            return updatedEntity;
        } catch (error) {
            await queryRunner.rollbackTransaction();

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
                    message: `Ha ocurrido un error al actualizar el servicio: ${error.message || 'Error desconocido'}`,
                    field: 'service'
                }
            ], 'Ha ocurrido un error inesperado');
        } finally {
            await queryRunner.release();
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
