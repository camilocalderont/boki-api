import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { ServiceStageEntity } from '../entities/serviceStage.entity';
import { ServiceEntity } from '../entities/service.entity';
import { CreateServiceStageDto } from '../dto/serviceStageCreate.dto';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class ServiceStageService {
  constructor(
    @InjectRepository(ServiceStageEntity)
    private readonly serviceStageRepository: Repository<ServiceStageEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>
  ) { }

  protected async validateCreate(createDto: CreateServiceStageDto): Promise<void> {
    const errors: ApiErrorItem[] = [];

    await this.validateRelationships(createDto, errors);

    if (errors.length > 0) {
      throw new ConflictException(errors, 'Error en la validación de la etapa del servicio');
    }
  }

  private async validateRelationships(dto: CreateServiceStageDto, errors: ApiErrorItem[]): Promise<void> {
    if (dto.ServiceId) {
      const service = await this.serviceRepository.findOne({
        where: { Id: dto.ServiceId }
      });

      if (!service) {
        errors.push({
          code: 'SERVICIO_NO_EXISTE',
          message: `El servicio con ID ${dto.ServiceId} no existe`,
          field: 'ServiceId'
        });
      }
    }
  }

  async create(createDto: CreateServiceStageDto): Promise<ServiceStageEntity> {
    try {
      await this.validateCreate(createDto);
      const entity = this.serviceStageRepository.create(createDto);
      return await this.serviceStageRepository.save(entity);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          [{
            code: 'RELACION_INVALIDA',
            message: 'Una o más relaciones especificadas no existen',
            field: 'serviceStage'
          }],
          'Una o más relaciones especificadas no existen'
        );
      }

      throw new BadRequestException(
        [{
          code: 'ERROR_CREACION_ETAPA',
          message: `Error al crear etapa de servicio: ${error.message || 'Error desconocido'}`,
          field: 'serviceStage'
        }],
        'Error al crear etapa de servicio'
      );
    }
  }

  async createMany(queryRunner: QueryRunner, serviceId: number, createDtos: CreateServiceStageDto[]): Promise<ServiceStageEntity[]> {
    try {
      await this.validateBulkCreation(queryRunner, serviceId, createDtos);

      const entities = [];
      for (const dto of createDtos) {
        const entity = this.serviceStageRepository.create({
          ...dto,
          ServiceId: serviceId
        });

        const savedEntity = await queryRunner.manager.save(entity);
        entities.push(savedEntity);
      }

      return entities;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          [{
            code: 'RELACION_INVALIDA',
            message: 'Una o más relaciones especificadas no existen',
            field: 'serviceStage'
          }],
          'Una o más relaciones especificadas no existen'
        );
      }

      throw new BadRequestException(
        [{
          code: 'ERROR_CREACION_ETAPAS',
          message: `Error al crear etapas de servicio: ${error.message || 'Error desconocido'}`,
          field: 'serviceStage'
        }],
        'Error al crear etapas de servicio'
      );
    }
  }

  private async validateBulkCreation(queryRunner: QueryRunner, serviceId: number, createDtos: CreateServiceStageDto[]): Promise<void> {
    const service = await queryRunner.manager.findOne(ServiceEntity, {
      where: { Id: serviceId }
    });

    if (!service) {
      throw new BadRequestException(
        [{
          code: 'SERVICIO_NO_EXISTE',
          message: `El servicio con ID ${serviceId} no existe`,
          field: 'ServiceId'
        }],
        `El servicio con ID ${serviceId} no existe`
      );
    }

    const sequences = createDtos.map(dto => dto.ISequence);
    const uniqueSequences = new Set(sequences);
    
    if (sequences.length !== uniqueSequences.size) {
      throw new BadRequestException(
        [{
          code: 'SECUENCIAS_DUPLICADAS',
          message: 'Las secuencias de etapas deben ser únicas',
          field: 'ISequence'
        }],
        'Las secuencias de etapas deben ser únicas'
      );
    }
  }
}
