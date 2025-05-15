import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Between, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { AppointmentEntity } from '../entities/appointment.entity';
import { AppointmentStageEntity } from '../entities/appointmentStage.entity';
import { CreateAppointmentDto } from '../dto/appointmentCreate.dto';
import { UpdateAppointmentDto } from '../dto/appointmentUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '../../../shared/interfaces/api-response.interface';
import { AppointmentStateService } from './appointmentState.service';
import { AppointmentStageService } from './appointmentStage.service';
import { ClientEntity } from '../../client/entities/client.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { ProfessionalEntity } from '../../professional/entities/professional.entity';
import { ProfessionalServiceEntity } from '../../professional/entities/professionalService.entity';
import { ProfessionalBussinessHourEntity } from '../../professional/entities/professionalBussinessHour.entity';
import { ServiceStageEntity } from '../../service/entities/serviceStage.entity';
import { CreateAppointmentStageDto } from '../dto/appointmentStageCreate.dto';
import { CreateAppointmentStateDto } from '../dto/appointmentStateCreate.dto';
import { log } from 'console';

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
    @InjectRepository(ProfessionalServiceEntity)
    private readonly professionalServiceRepository: Repository<ProfessionalServiceEntity>,
    @InjectRepository(ProfessionalBussinessHourEntity)
    private readonly professionalBussinessHourRepository: Repository<ProfessionalBussinessHourEntity>,
    @InjectRepository(ServiceStageEntity)
    private readonly serviceStageRepository: Repository<ServiceStageEntity>,
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

    if (errors.length > 0) {
      throw new ConflictException(errors, 'Error en la validación de agendamiento');
    }

    const professionalServiceExists = await this.professionalServiceRepository.findOne({
      where: { 
        ProfessionalId: createAppointmentDto.ProfessionalId,
        ServiceId: createAppointmentDto.ServiceId
      }
    });

    if (!professionalServiceExists) {
      errors.push({
        code: 'PROFESIONAL_SERVICIO_NO_ASOCIADOS',
        message: `El profesional con ID ${createAppointmentDto.ProfessionalId} no ofrece el servicio con ID ${createAppointmentDto.ServiceId}`,
        field: 'ProfessionalId,ServiceId'
      });
    }

    if (createAppointmentDto.DtDate && createAppointmentDto.TStartTime) {
      const appointmentDate = new Date(createAppointmentDto.DtDate);
      let dayOfWeek = appointmentDate.getDay(); 
      
      dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      
      const businessHour = await this.professionalBussinessHourRepository.findOne({
        where: {
          ProfessionalId: createAppointmentDto.ProfessionalId,
          IDayOfWeek: dayOfWeek
        }
      });

      if (!businessHour) {
        errors.push({
          code: 'PROFESIONAL_NO_TRABAJA_ESE_DIA',
          message: `El profesional no trabaja el día seleccionado`,
          field: 'DtDate'
        });
      } else {
        const appointmentTime = createAppointmentDto.TStartTime;
        
        let startTime = '';
        let endTime = '';
        
        if (businessHour.TStartTime) {
          startTime = businessHour.TStartTime instanceof Date 
            ? businessHour.TStartTime.toTimeString().substring(0, 5) 
            : String(businessHour.TStartTime).substring(0, 5);
        }
        
        if (businessHour.TEndTime) {
          endTime = businessHour.TEndTime instanceof Date 
            ? businessHour.TEndTime.toTimeString().substring(0, 5) 
            : String(businessHour.TEndTime).substring(0, 5);
        }

        if (appointmentTime < startTime || appointmentTime > endTime) {
          errors.push({
            code: 'HORA_FUERA_HORARIO_LABORAL',
            message: `La hora seleccionada está fuera del horario laboral del profesional (${startTime} - ${endTime})`,
            field: 'TStartTime'
          });
        }

        if (businessHour.TBreakStartTime && businessHour.TBreakEndTime) {
          let breakStartTime = '';
          let breakEndTime = '';
          
          if (businessHour.TBreakStartTime) {
            breakStartTime = businessHour.TBreakStartTime instanceof Date 
              ? businessHour.TBreakStartTime.toTimeString().substring(0, 5) 
              : String(businessHour.TBreakStartTime).substring(0, 5);
          }
          
          if (businessHour.TBreakEndTime) {
            breakEndTime = businessHour.TBreakEndTime instanceof Date 
              ? businessHour.TBreakEndTime.toTimeString().substring(0, 5) 
              : String(businessHour.TBreakEndTime).substring(0, 5);
          }

          if (appointmentTime >= breakStartTime && appointmentTime <= breakEndTime) {
            errors.push({
              code: 'HORA_EN_DESCANSO',
              message: `La hora seleccionada coincide con el período de descanso del profesional (${breakStartTime} - ${breakEndTime})`,
              field: 'TStartTime'
            });
          }
        }
      }
    }

    if (createAppointmentDto.DtDate && createAppointmentDto.TStartTime && errors.length === 0) {
      const date = new Date(createAppointmentDto.DtDate);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

      const existingAppointment = await this.appointmentRepository.findOne({
        where: {
          ProfessionalId: createAppointmentDto.ProfessionalId,
          DtDate: Between(startOfDay, endOfDay),
          TStartTime: createAppointmentDto.TStartTime,
          CurrentStateId: Not(3)
        }
      });

      if (existingAppointment) {
        errors.push({
          code: 'CITA_YA_EXISTE',
          message: `El profesional ya tiene una cita programada en la hora seleccionada`,
          field: 'TStartTime'
        });
      }
    }

    if (errors.length > 0) {
      throw new ConflictException(errors, 'Error en la validación de agendamiento');
    }
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.validateCreate(createAppointmentDto);
      
      const appointmentData = {...createAppointmentDto};
      
      const serviceStages = await this.serviceStageRepository.find({
        where: { ServiceId: createAppointmentDto.ServiceId },
        order: { ISequence: 'ASC' }
      });

      if (!serviceStages || serviceStages.length === 0) {
        throw new BadRequestException(
          [{
            code: 'ETAPAS_SERVICIO_NO_EXISTEN',
            message: `El servicio con ID ${createAppointmentDto.ServiceId} no tiene etapas definidas`,
            field: 'ServiceId'
          }],
          'El servicio no tiene etapas definidas'
        );
      }

      const totalDurationMinutes = serviceStages.reduce((total, stage) => total + stage.IDurationMinutes, 0);
      
      const appointmentDate = new Date(createAppointmentDto.DtDate);
      const [hours, minutes] = createAppointmentDto.TStartTime.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      const endDateTime = new Date(appointmentDate.getTime());
      endDateTime.setMinutes(endDateTime.getMinutes() + totalDurationMinutes);
      
      const endHours = endDateTime.getHours().toString().padStart(2, '0');
      const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');
      const endTimeString = `${endHours}:${endMinutes}`;
      
      appointmentData['TEndTime'] = endTimeString;
      
      const entity = this.appointmentRepository.create(appointmentData);
      const savedEntity = await queryRunner.manager.save(entity);

      const appointmentStages: CreateAppointmentStageDto[] = [];
      let currentDateTime = new Date(appointmentDate.getTime());
      
      for (const serviceStage of serviceStages) {
        const startDateTime = new Date(currentDateTime.getTime());
        const endDateTime = new Date(startDateTime.getTime());
        endDateTime.setMinutes(endDateTime.getMinutes() + serviceStage.IDurationMinutes);
        
        appointmentStages.push({
          ServiceStageId: serviceStage.Id,
          StartDateTime: startDateTime,
          EndDateTime: endDateTime,
          BlsProfessionalBusy: serviceStage.BIsProfessionalBussy
        });
        
        currentDateTime = new Date(endDateTime.getTime());
      }
      
      if (appointmentStages.length > 0) {
        const appointmentStageEntities = await this.appointmentStageService.createMany(
          queryRunner,
          savedEntity.Id,
          appointmentStages
        );
        savedEntity.AppointmentStages = appointmentStageEntities;
      }

      const appointmentState: CreateAppointmentStateDto = {
        StateId: createAppointmentDto.CurrentStateId,
        VcChangedBy: '1',
        VcReason: 'Creación inicial de cita',
        DtDateTime: new Date(),
        DtPreviousDate: appointmentDate,
        TPreviousTime: createAppointmentDto.TStartTime,
        DtCurrentDate: appointmentDate,
        TCurrentTime: createAppointmentDto.TStartTime
      };
      
      const appointmentStateEntities = await this.appointmentStateService.createMany(
        queryRunner,
        savedEntity.Id,
        [appointmentState]
      );
      savedEntity.AppointmentStates = appointmentStateEntities;

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

    const professionalId = updateAppointmentDto.ProfessionalId || appointment.ProfessionalId;
    const serviceId = updateAppointmentDto.ServiceId || appointment.ServiceId;

    if (updateAppointmentDto.ProfessionalId || updateAppointmentDto.ServiceId) {
      const professionalServiceExists = await this.professionalServiceRepository.findOne({
        where: { 
          ProfessionalId: professionalId,
          ServiceId: serviceId
        }
      });

      if (!professionalServiceExists) {
        errors.push({
          code: 'PROFESIONAL_SERVICIO_NO_ASOCIADOS',
          message: `El profesional con ID ${professionalId} no ofrece el servicio con ID ${serviceId}`,
          field: 'ProfessionalId,ServiceId'
        });
      }
    }

    if (updateAppointmentDto.DtDate || updateAppointmentDto.TStartTime) {
      const appointmentDate = updateAppointmentDto.DtDate 
        ? new Date(updateAppointmentDto.DtDate) 
        : appointment.DtDate;
      
      let dayOfWeek = appointmentDate.getDay(); 
      const appointmentTime = updateAppointmentDto.TStartTime || appointment.TStartTime;
      
      dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      
      const businessHour = await this.professionalBussinessHourRepository.findOne({
        where: {
          ProfessionalId: professionalId,
          IDayOfWeek: dayOfWeek
        }
      });

      if (!businessHour) {
        errors.push({
          code: 'PROFESIONAL_NO_TRABAJA_ESE_DIA',
          message: `El profesional no trabaja el día seleccionado`,
          field: 'DtDate'
        });
      } else {
        let startTime = '';
        let endTime = '';
        
        if (businessHour.TStartTime) {
          startTime = businessHour.TStartTime instanceof Date 
            ? businessHour.TStartTime.toTimeString().substring(0, 5) 
            : String(businessHour.TStartTime).substring(0, 5);
        }
        
        if (businessHour.TEndTime) {
          endTime = businessHour.TEndTime instanceof Date 
            ? businessHour.TEndTime.toTimeString().substring(0, 5) 
            : String(businessHour.TEndTime).substring(0, 5);
        }

        if (appointmentTime < startTime || appointmentTime > endTime) {
          errors.push({
            code: 'HORA_FUERA_HORARIO_LABORAL',
            message: `La hora seleccionada está fuera del horario laboral del profesional (${startTime} - ${endTime})`,
            field: 'TStartTime'
          });
        }

        if (businessHour.TBreakStartTime && businessHour.TBreakEndTime) {
          let breakStartTime = '';
          let breakEndTime = '';
          
          if (businessHour.TBreakStartTime) {
            breakStartTime = businessHour.TBreakStartTime instanceof Date 
              ? businessHour.TBreakStartTime.toTimeString().substring(0, 5) 
              : String(businessHour.TBreakStartTime).substring(0, 5);
          }
          
          if (businessHour.TBreakEndTime) {
            breakEndTime = businessHour.TBreakEndTime instanceof Date 
              ? businessHour.TBreakEndTime.toTimeString().substring(0, 5) 
              : String(businessHour.TBreakEndTime).substring(0, 5);
          }

          if (appointmentTime >= breakStartTime && appointmentTime <= breakEndTime) {
            errors.push({
              code: 'HORA_EN_DESCANSO',
              message: `La hora seleccionada coincide con el período de descanso del profesional (${breakStartTime} - ${breakEndTime})`,
              field: 'TStartTime'
            });
          }
        }
      }

      if (errors.length === 0) {
        const date = appointmentDate;
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

        const existingAppointment = await this.appointmentRepository.findOne({
          where: {
            Id: Not(id),
            ProfessionalId: professionalId,
            DtDate: Between(startOfDay, endOfDay),
            TStartTime: appointmentTime,
            CurrentStateId: Not(3)
          }
        });

        if (existingAppointment) {
          errors.push({
            code: 'CITA_YA_EXISTE',
            message: `El profesional ya tiene una cita programada en la hora seleccionada`,
            field: 'TStartTime'
          });
        }
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
      const existingAppointment = await this.appointmentRepository.findOne({
        where: { Id: id },
        relations: ['AppointmentStages', 'AppointmentStates']
      });

      if (!existingAppointment) {
        throw new NotFoundException([
          {
            code: 'CITA_NO_EXISTE',
            message: `La cita con ID ${id} no existe`,
            field: 'id'
          }
        ], `La cita con ID ${id} no existe`);
      }

      const isCancelling = updateAppointmentDto.CurrentStateId === 3;
      
      if (!isCancelling) {
        await this.validateUpdate(id, updateAppointmentDto);
      }
      
      if (!updateAppointmentDto.CurrentStateId || updateAppointmentDto.CurrentStateId === existingAppointment.CurrentStateId) {
        const appointmentData = {...updateAppointmentDto};
        
        Object.assign(existingAppointment, appointmentData);
        const updatedEntity = await queryRunner.manager.save(existingAppointment);
        await queryRunner.commitTransaction();
        return updatedEntity;
      }

      const currentState = existingAppointment.CurrentStateId;
      const newState = updateAppointmentDto.CurrentStateId;
      
      const appointmentState = {
        StateId: newState,
        VcChangedBy: '1', 
        VcReason: this.getStateChangeReason(currentState, newState),
        DtDateTime: new Date(),
        DtPreviousDate: existingAppointment.DtDate,
        TPreviousTime: existingAppointment.TStartTime,
        DtCurrentDate: updateAppointmentDto.DtDate || existingAppointment.DtDate,
        TCurrentTime: updateAppointmentDto.TStartTime || existingAppointment.TStartTime,
        AppointmentId: existingAppointment.Id
      };

      const appointmentStateEntities = await this.appointmentStateService.createMany(
        queryRunner,
        existingAppointment.Id,
        [appointmentState]
      );
      
      existingAppointment.AppointmentStates = [
        ...(existingAppointment.AppointmentStates || []),
        ...appointmentStateEntities
      ];
      
      existingAppointment.CurrentStateId = newState;

      if (newState === 4 && (updateAppointmentDto.DtDate || updateAppointmentDto.TStartTime)) {
        if (updateAppointmentDto.DtDate) {
          existingAppointment.DtDate = updateAppointmentDto.DtDate;
        }
        
        if (updateAppointmentDto.TStartTime) {
          existingAppointment.TStartTime = updateAppointmentDto.TStartTime;
        }
        
        const serviceStages = await this.serviceStageRepository.find({
          where: { ServiceId: existingAppointment.ServiceId },
          order: { ISequence: 'ASC' }
        });

        if (serviceStages && serviceStages.length > 0) {
          const totalDurationMinutes = serviceStages.reduce((total, stage) => total + stage.IDurationMinutes, 0);
          
          const appointmentDate = new Date(existingAppointment.DtDate);
          const [hours, minutes] = existingAppointment.TStartTime.split(':').map(Number);
          appointmentDate.setHours(hours, minutes, 0, 0);
          
          const endDateTime = new Date(appointmentDate.getTime());
          endDateTime.setMinutes(endDateTime.getMinutes() + totalDurationMinutes);
          
          const endHours = endDateTime.getHours().toString().padStart(2, '0');
          const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');
          const endTimeString = `${endHours}:${endMinutes}`;
          
          existingAppointment.TEndTime = endTimeString;
          
          const updatedAppointment = await queryRunner.manager.save(existingAppointment);
          
          if (existingAppointment.AppointmentStages && existingAppointment.AppointmentStages.length > 0) {
            await queryRunner.manager.delete(AppointmentStageEntity, { AppointmentId: updatedAppointment.Id });
          }
          
          const appointmentStages: CreateAppointmentStageDto[] = [];
          let currentDateTime = new Date(appointmentDate.getTime());
          
          for (const serviceStage of serviceStages) {
            const startDateTime = new Date(currentDateTime.getTime());
            const endDateTime = new Date(startDateTime.getTime());
            endDateTime.setMinutes(endDateTime.getMinutes() + serviceStage.IDurationMinutes);
            
            appointmentStages.push({
              ServiceStageId: serviceStage.Id,
              StartDateTime: startDateTime,
              EndDateTime: endDateTime,
              BlsProfessionalBusy: serviceStage.BIsProfessionalBussy
            });
            
            currentDateTime = new Date(endDateTime.getTime());
          }
          
          if (appointmentStages.length > 0) {
            const newStages = await this.appointmentStageService.createMany(
              queryRunner,
              updatedAppointment.Id,
              appointmentStages
            );
            
            updatedAppointment.AppointmentStages = newStages;
          }
          
          Object.assign(existingAppointment, updatedAppointment);
        }
      }
      
      const result = await queryRunner.manager.save(existingAppointment);
      await queryRunner.commitTransaction();
      return result;
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

  private getStateChangeReason(currentState: number, newState: number): string {
    switch (newState) {
      case 2:
        return 'Cita confirmada';
      case 3:
        return 'Cita cancelada';
      case 4:
        return 'Cita reagendada';
      default:
        const stateNames = {
          1: 'Creada',
          2: 'Confirmada',
          3: 'Cancelada',
          4: 'Reagendada'
        };
        return `Cambio de estado: ${stateNames[currentState] || 'Desconocido'} a ${stateNames[newState] || 'Desconocido'}`;
    }
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { Id: id },
        relations: ['AppointmentStages', 'AppointmentStates']
      });
      
      if (!appointment) {
        throw new NotFoundException([
          {
            code: 'CITA_NO_EXISTE',
            message: `La cita con ID ${id} no existe`,
            field: 'id'
          }
        ], `La cita con ID ${id} no existe`);
      }

      if (appointment.AppointmentStages && appointment.AppointmentStages.length > 0) {
        await queryRunner.manager.delete('AppointmentStage', { AppointmentId: id });
      }

      if (appointment.AppointmentStates && appointment.AppointmentStates.length > 0) {
        await queryRunner.manager.delete('AppointmentState', { AppointmentId: id });
      }

      await queryRunner.manager.delete('Appointment', { Id: id });
      
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new BadRequestException(
        [{
          code: 'ERROR_ELIMINACION_CITA',
          message: `Ha ocurrido un error al eliminar la cita: ${error.message || 'Error desconocido'}`,
          field: 'appointment'
        }],
        'Ha ocurrido un error al eliminar la cita'
      );
    } finally {
      await queryRunner.release();
    }
  }
}
