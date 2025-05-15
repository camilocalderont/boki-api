import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { ProfessionalBussinessHourEntity } from '../entities/professionalBussinessHour.entity';
import { ProfessionalEntity } from '../entities/professional.entity';
import { CompanyBranchRoomEntity } from '../../companyBranch/entities/companyBranchRoom.entity';
import { CreateProfessionalBussinessHourDto } from '../dto/professionalBussinessHourCreate.dto';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class ProfessionalBussinessHourService {
  constructor(
    @InjectRepository(ProfessionalBussinessHourEntity)
    private readonly professionalBussinessHourRepository: Repository<ProfessionalBussinessHourEntity>,
    @InjectRepository(ProfessionalEntity)
    private readonly professionalRepository: Repository<ProfessionalEntity>,
    @InjectRepository(CompanyBranchRoomEntity)
    private readonly companyBranchRoomRepository: Repository<CompanyBranchRoomEntity>
  ) { }

  protected async validateCreate(createDto: CreateProfessionalBussinessHourDto): Promise<void> {
    const errors: ApiErrorItem[] = [];

    await this.validateRelationships(createDto, errors);

    if (createDto.ProfessionalId) {
      await this.validateScheduleOverlap(createDto, errors);
    }

    if (errors.length > 0) {
      throw new ConflictException(errors, 'Error en la validación del horario');
    }
  }

  private async validateRelationships(dto: CreateProfessionalBussinessHourDto, errors: ApiErrorItem[]): Promise<void> {
    if (dto.ProfessionalId) {
      const professional = await this.professionalRepository.findOne({
        where: { Id: dto.ProfessionalId }
      });

      if (!professional) {
        errors.push({
          code: 'PROFESIONAL_NO_EXISTE',
          message: `El profesional con ID ${dto.ProfessionalId} no existe`,
          field: 'ProfessionalId'
        });
      }
    }

    const room = await this.companyBranchRoomRepository.findOne({
      where: { Id: dto.CompanyBranchRoomId }
    });

    if (!room) {
      errors.push({
        code: 'SALA_NO_EXISTE',
        message: `La sala con ID ${dto.CompanyBranchRoomId} no existe`,
        field: 'CompanyBranchRoomId'
      });
    }
  }

  private async validateScheduleOverlap(dto: CreateProfessionalBussinessHourDto, errors: ApiErrorItem[]): Promise<void> {
    const overlappingHours = await this.professionalBussinessHourRepository.find({
      where: {
        ProfessionalId: dto.ProfessionalId,
        IDayOfWeek: dto.IDayOfWeek
      }
    });

    for (const hour of overlappingHours) {
      if (this.isTimeOverlapping(
        new Date(dto.TStartTime), new Date(dto.TEndTime),
        new Date(hour.TStartTime), new Date(hour.TEndTime)
      )) {
        errors.push({
          code: 'HORARIO_SOLAPADO',
          message: `El horario se solapa con otro existente para el mismo día`,
          field: 'TStartTime'
        });
        break;
      }
    }
  }

  private isTimeOverlapping(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
    return (
      (startA <= endB && startB <= endA)
    );
  }

  async create(createDto: CreateProfessionalBussinessHourDto): Promise<ProfessionalBussinessHourEntity> {
    try {
      await this.validateCreate(createDto);
      const entity = this.professionalBussinessHourRepository.create(createDto);
      return await this.professionalBussinessHourRepository.save(entity);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          [{
            code: 'RELACION_INVALIDA',
            message: 'Una o más relaciones especificadas no existen',
            field: 'professionalBussinessHour'
          }],
          'Una o más relaciones especificadas no existen'
        );
      }

      throw new BadRequestException(
        [{
          code: 'ERROR_CREACION_HORARIO',
          message: `Error al crear horario: ${error.message || 'Error desconocido'}`,
          field: 'professionalBussinessHour'
        }],
        'Error al crear horario'
      );
    }
  }

  async createMany(queryRunner: QueryRunner, professionalId: number, createDtos: CreateProfessionalBussinessHourDto[]): Promise<ProfessionalBussinessHourEntity[]> {
    try {
      await this.validateBulkCreation(queryRunner, professionalId, createDtos);

      const entities = [];
      for (const dto of createDtos) {
        const entity = this.professionalBussinessHourRepository.create({
          ...dto,
          ProfessionalId: professionalId
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
            field: 'professionalBussinessHour'
          }],
          'Una o más relaciones especificadas no existen'
        );
      }

      throw new BadRequestException(
        [{
          code: 'ERROR_CREACION_HORARIOS',
          message: `Error al crear horarios: ${error.message || 'Error desconocido'}`,
          field: 'professionalBussinessHour'
        }],
        'Error al crear horarios'
      );
    }
  }

  private async validateBulkCreation(queryRunner: QueryRunner, professionalId: number, createDtos: CreateProfessionalBussinessHourDto[]): Promise<void> {
    const professional = await queryRunner.manager.findOne(ProfessionalEntity, {
      where: { Id: professionalId }
    });

    if (!professional) {
      throw new BadRequestException(
        [{
          code: 'PROFESIONAL_NO_EXISTE',
          message: `El profesional con ID ${professionalId} no existe`,
          field: 'ProfessionalId'
        }],
        `El profesional con ID ${professionalId} no existe`
      );
    }

    for (const dto of createDtos) {
      const room = await queryRunner.manager.findOne(CompanyBranchRoomEntity, {
        where: { Id: dto.CompanyBranchRoomId }
      });

      if (!room) {
        throw new BadRequestException(
          [{
            code: 'SALA_NO_EXISTE',
            message: `La sala con ID ${dto.CompanyBranchRoomId} no existe`,
            field: 'CompanyBranchRoomId'
          }],
          `La sala con ID ${dto.CompanyBranchRoomId} no existe`
        );
      }
    }

    this.checkScheduleConflicts(createDtos);
  }

  private checkScheduleConflicts(schedules: CreateProfessionalBussinessHourDto[]): void {
    const schedulesByDay = {};

    for (const schedule of schedules) {
      if (!schedulesByDay[schedule.IDayOfWeek]) {
        schedulesByDay[schedule.IDayOfWeek] = [];
      }
      schedulesByDay[schedule.IDayOfWeek].push(schedule);
    }

    for (const day in schedulesByDay) {
      const daySchedules = schedulesByDay[day];
      if (daySchedules.length <= 1) continue;

      for (let i = 0; i < daySchedules.length - 1; i++) {
        const scheduleA = daySchedules[i];
        const startA = new Date(scheduleA.TStartTime);
        const endA = new Date(scheduleA.TEndTime);

        for (let j = i + 1; j < daySchedules.length; j++) {
          const scheduleB = daySchedules[j];
          const startB = new Date(scheduleB.TStartTime);
          const endB = new Date(scheduleB.TEndTime);

          if (this.isTimeOverlapping(startA, endA, startB, endB)) {
            throw new BadRequestException(
              [{
                code: 'HORARIOS_SOLAPADOS',
                message: `Hay solapamiento entre los horarios para el día ${day}`,
                field: 'BussinessHours'
              }],
              `Hay solapamiento entre los horarios para el día ${day}`
            );
          }
        }
      }
    }
  }

  async findByProfessional(professionalId: number): Promise<ProfessionalBussinessHourEntity[]> {
    return this.professionalBussinessHourRepository.find({
      where: { ProfessionalId: professionalId },
      order: { IDayOfWeek: 'ASC', TStartTime: 'ASC' }
    });
  }
}