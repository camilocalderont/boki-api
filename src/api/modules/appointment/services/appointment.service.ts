import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AppointmentEntity } from '../entities/appointment.entity';
import { CreateAppointmentDto } from '../dto/appointmentCreate.dto';
import { UpdateAppointmentDto } from '../dto/appointmentUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '../../../shared/interfaces/api-response.interface';
import { AppointmentStateService } from './appointmentState.service';
import { AppointmentStageService } from './appointmentStage.service';
import { ClientEntity } from '../../client/entities/client.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { ProfessionalEntity } from '../../professional/entities/professional.entity';

@Injectable()
export class AppointmentService extends BaseCrudService<AppointmentEntity, CreateAppointmentDto, UpdateAppointmentDto> {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(ProfessionalEntity)
    private readonly professionalRepository: Repository<ProfessionalEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(AppointmentStateService)
    private readonly appointmentStateService: AppointmentStateService,
    @Inject(AppointmentStageService)
    private readonly appointmentStageService: AppointmentStageService
  ) {
    super(appointmentRepository);
  }

  protected async validateCreate(createAppointmentDto: CreateAppointmentDto): Promise<void> {
    const errors: ApiErrorItem[] = [];

    const clientExists = await this.clientRepository.findOne({
      where: { Id: createAppointmentDto.ClientId }
    });
    
    if (!clientExists) {
      errors.push({
        code: 'CLIENTE_NO_EXISTE',
        message: `El cliente con ID ${createAppointmentDto.ClientId} no existe`,
        field: 'ClientId'
      });
    }

    const serviceExists = await this.serviceRepository.findOne({
      where: { Id: createAppointmentDto.ServiceId }
    });
    
    if (!serviceExists) {
      errors.push({
        code: 'SERVICIO_NO_EXISTE',
        message: `El servicio con ID ${createAppointmentDto.ServiceId} no existe`,
        field: 'ServiceId'
      });
    }

    const professionalExists = await this.professionalRepository.findOne({
      where: { Id: createAppointmentDto.ProfessionalId }
    });
    
    if (!professionalExists) {
      errors.push({
        code: 'PROFESIONAL_NO_EXISTE',
        message: `El profesional con ID ${createAppointmentDto.ProfessionalId} no existe`,
        field: 'ProfessionalId'
      });
    }

    if (errors.length > 0) {
      throw new ConflictException(errors, 'Error en la validación de la cita');
    }
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.validateCreate(createAppointmentDto);
      
      const { AppointmentStages, AppointmentStates, ...appointmentData } = createAppointmentDto;
      const entity = this.appointmentRepository.create(appointmentData);
      const savedEntity = await queryRunner.manager.save(entity);

      if (AppointmentStages && Array.isArray(AppointmentStages) && AppointmentStages.length > 0) {
        const appointmentStageEntities = await this.appointmentStageService.createMany(
          queryRunner,
          savedEntity.Id,
          AppointmentStages
        );
        savedEntity.AppointmentStages = appointmentStageEntities;
      }

      if (AppointmentStates && Array.isArray(AppointmentStates) && AppointmentStates.length > 0) {
        const appointmentStateEntities = await this.appointmentStateService.createMany(
          queryRunner,
          savedEntity.Id,
          AppointmentStates
        );
        savedEntity.AppointmentStates = appointmentStateEntities;
      }

      await queryRunner.commitTransaction();
      return savedEntity;

    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }

      if (error.code === '23505') {
        throw new ConflictException(
          [{
            code: 'YA_EXISTE_CITA',
            message: 'Ya existe una cita con estos datos',
            field: 'appointment'
          }],
          'Ya existe una cita con estos datos'
        );
      }

      throw new BadRequestException(
        [{
          code: 'ERROR_CREACION_CITA',
          message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
          field: 'appointment'
        }],
        'Ha ocurrido un error inesperado'
      );
    } finally {
      await queryRunner.release();
    }
  }

  protected async validateUpdate(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<void> {
    const errors: ApiErrorItem[] = [];

    let appointment: AppointmentEntity;
    try {
      appointment = await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException([
          {
            code: 'CITA_NO_EXISTE',
            message: `La cita con ID ${id} no existe`,
            field: 'id'
          }
        ], `La cita con ID ${id} no existe`);
      }
      throw error;
    }

    if (updateAppointmentDto.ClientId) {
      const clientExists = await this.clientRepository.findOne({
        where: { Id: updateAppointmentDto.ClientId }
      });
      
      if (!clientExists) {
        errors.push({
          code: 'CLIENTE_NO_EXISTE',
          message: `El cliente con ID ${updateAppointmentDto.ClientId} no existe`,
          field: 'ClientId'
        });
      }
    }

    if (updateAppointmentDto.ServiceId) {
      const serviceExists = await this.serviceRepository.findOne({
        where: { Id: updateAppointmentDto.ServiceId }
      });
      
      if (!serviceExists) {
        errors.push({
          code: 'SERVICIO_NO_EXISTE',
          message: `El servicio con ID ${updateAppointmentDto.ServiceId} no existe`,
          field: 'ServiceId'
        });
      }
    }

    if (updateAppointmentDto.ProfessionalId) {
      const professionalExists = await this.professionalRepository.findOne({
        where: { Id: updateAppointmentDto.ProfessionalId }
      });
      
      if (!professionalExists) {
        errors.push({
          code: 'PROFESIONAL_NO_EXISTE',
          message: `El profesional con ID ${updateAppointmentDto.ProfessionalId} no existe`,
          field: 'ProfessionalId'
        });
      }
    }

    if (errors.length > 0) {
      throw new ConflictException(errors, 'Error en la validación de la cita');
    }
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.validateUpdate(id, updateAppointmentDto);
      
      const { AppointmentStages, AppointmentStates, ...appointmentData } = updateAppointmentDto;
      
      const existingEntity = await this.appointmentRepository.findOne({
        where: { Id: id },
        relations: ['AppointmentStages', 'AppointmentStates']
      });

      if (!existingEntity) {
        throw new NotFoundException([
          {
            code: 'CITA_NO_EXISTE',
            message: `La cita con ID ${id} no existe`,
            field: 'id'
          }
        ], `La cita con ID ${id} no existe`);
      }

      Object.assign(existingEntity, appointmentData);
      
      const updatedEntity = await queryRunner.manager.save(existingEntity);

      if (AppointmentStages && Array.isArray(AppointmentStages) && AppointmentStages.length > 0) {
        const appointmentStageEntities = await this.appointmentStageService.updateMany(
          queryRunner,
          updatedEntity.Id,
          AppointmentStages
        );
        updatedEntity.AppointmentStages = appointmentStageEntities;
      }

      if (AppointmentStates && Array.isArray(AppointmentStates) && AppointmentStates.length > 0) {
        const newState = AppointmentStates[0];
        
        const appointmentStateEntities = await this.appointmentStateService.addAppointmentState(
          queryRunner,
          updatedEntity.Id,
          newState
        );
        updatedEntity.AppointmentStates = appointmentStateEntities;
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
            code: 'YA_EXISTE_CITA',
            message: 'Ya existe una cita con estos datos',
            field: 'appointment'
          }],
          'Ya existe una cita con estos datos'
        );
      }

      throw new BadRequestException(
        [{
          code: 'ERROR_ACTUALIZACION_CITA',
          message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
          field: 'appointment'
        }],
        'Ha ocurrido un error inesperado'
      );
    } finally {
      await queryRunner.release();
    }
  }

}
