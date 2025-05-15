import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { ProfessionalServiceEntity } from '../entities/professionalService.entity';
import { CreateProfessionalServiceDto } from '../dto/professionalServiceCreate.dto';

@Injectable()
export class ProfessionalServiceService {
  constructor(
    @InjectRepository(ProfessionalServiceEntity)
    private readonly professionalServiceRepository: Repository<ProfessionalServiceEntity>
  ) {}

  async create(createDto: CreateProfessionalServiceDto): Promise<ProfessionalServiceEntity> {
    try {
      const entity = this.professionalServiceRepository.create(createDto);
      return await this.professionalServiceRepository.save(entity);
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException(
          [{ 
            code: 'RELACION_INVALIDA',
            message: `El servicio o profesional con ID ${createDto.ServiceId} no existe`,
            field: 'professionalService'
          }],
          'El servicio o profesional especificado no existe'
        );
      }
      throw new BadRequestException(
        [{
          code: 'ERROR_CREACION_SERVICIO',
          message: `Error al asignar servicio: ${error.message || 'Error desconocido'}`,
          field: 'professionalService'
        }],
        'Error al asignar servicio'
      );
    }
  }

  async createMany(queryRunner: QueryRunner, professionalId: number, createDtos: CreateProfessionalServiceDto[]): Promise<ProfessionalServiceEntity[]> {
    try {
      const entities = [];
      
      for (const dto of createDtos) {
        const serviceData = {
          ...dto,
          ProfessionalId: professionalId
        };
        
        const entity = this.professionalServiceRepository.create(serviceData);
        const savedEntity = await queryRunner.manager.save(entity);
        entities.push(savedEntity);
      }
      
      return entities;
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException(
          [{
            code: 'RELACION_INVALIDA',
            message: `Uno o más servicios con ID ${createDtos.map(dto => dto.ServiceId)} no existen`,
            field: 'professionalService'
          }],
          'Uno o más servicios especificados no existen'
        );
      }
      throw new BadRequestException(
        [{
          code: 'ERROR_CREACION_SERVICIOS',
          message: `Error al asignar servicios: ${error.message || 'Error desconocido'}`,
          field: 'professionalService'
        }],
        'Error al asignar servicios'
      );
    }
  }

  async findByProfessional(professionalId: number): Promise<ProfessionalServiceEntity[]> {
    return await this.professionalServiceRepository.find({
      where: { ProfessionalId: professionalId },
      relations: ['Service']
    });
  }
}
