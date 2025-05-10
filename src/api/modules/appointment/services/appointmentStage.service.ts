import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { AppointmentStageEntity } from '../entities/appointmentStage.entity';
import { CreateAppointmentStageDto } from '../dto/appointmentStageCreate.dto';
import { UpdateAppointmentStageDto } from '../dto/appointmentStageUpdate.dto';
import { AppointmentEntity } from '../entities/appointment.entity';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class AppointmentStageService {
    constructor(
        @InjectRepository(AppointmentStageEntity)
        private readonly appointmentStageRepository: Repository<AppointmentStageEntity>,
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepository: Repository<AppointmentEntity>
    ) {}

    protected async validateCreate(createDto: CreateAppointmentStageDto, appointmentId: number): Promise<void> {
        const errors: ApiErrorItem[] = [];

        const appointment = await this.appointmentRepository.findOne({
            where: { Id: appointmentId }
        });
        
        if (!appointment) {
            errors.push({
                code: 'CITA_NO_EXISTE',
                message: `La cita con ID ${appointmentId} no existe`,
                field: 'appointmentId'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, 'Error en la validación de la etapa');
        }
    }

    async create(createAppointmentStageDto: CreateAppointmentStageDto, appointmentId: number): Promise<AppointmentStageEntity> {
        try {
            await this.validateCreate(createAppointmentStageDto, appointmentId);
            const entity = this.appointmentStageRepository.create({
                ...createAppointmentStageDto,
                AppointmentId: appointmentId
            });
            return await this.appointmentStageRepository.save(entity);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23503') {
                throw new BadRequestException(
                    [{
                        code: 'RELACION_INVALIDA',
                        message: 'Una o más relaciones especificadas no existen',
                        field: 'appointmentStage'
                    }],
                    'Una o más relaciones especificadas no existen'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_ETAPA',
                    message: `Error al crear etapa: ${error.message || 'Error desconocido'}`,
                    field: 'appointmentStage'
                }],
                'Error al crear etapa'
            );
        }
    }

    async createMany(queryRunner: QueryRunner, appointmentId: number, stages: CreateAppointmentStageDto[]): Promise<AppointmentStageEntity[]> {
        try {
            const stageEntities: AppointmentStageEntity[] = [];

            for (const stage of stages) {
                const entity = this.appointmentStageRepository.create({
                    ...stage,
                    AppointmentId: appointmentId
                });

                const savedEntity = await queryRunner.manager.save(entity);
                stageEntities.push(savedEntity);
            }

            return stageEntities;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_ETAPAS',
                    message: `Error al crear etapas: ${error.message || 'Error desconocido'}`,
                    field: 'appointmentStage'
                }],
                'Error al crear etapas'
            );
        }
    }

    protected async validateUpdate(id: number, updateDto: UpdateAppointmentStageDto, appointmentId?: number): Promise<void> {
        const errors: ApiErrorItem[] = [];

        const existingStage = await this.appointmentStageRepository.findOne({
            where: { Id: id }
        });

        if (!existingStage) {
            throw new NotFoundException([
                {
                    code: 'ETAPA_NO_EXISTE',
                    message: `La etapa con ID ${id} no existe`,
                    field: 'id'
                }
            ], `La etapa con ID ${id} no existe`);
        }

        if (appointmentId && appointmentId !== existingStage.AppointmentId) {
            const appointment = await this.appointmentRepository.findOne({
                where: { Id: appointmentId }
            });
            
            if (!appointment) {
                errors.push({
                    code: 'CITA_NO_EXISTE',
                    message: `La cita con ID ${appointmentId} no existe`,
                    field: 'appointmentId'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, 'Error en la validación de la etapa');
        }
    }

    async update(id: number, updateDto: UpdateAppointmentStageDto, appointmentId?: number): Promise<AppointmentStageEntity> {
        try {
            await this.validateUpdate(id, updateDto, appointmentId);
            
            const existingEntity = await this.appointmentStageRepository.findOne({
                where: { Id: id }
            });

            if (!existingEntity) {
                throw new NotFoundException([
                    {
                        code: 'ETAPA_NO_EXISTE',
                        message: `La etapa con ID ${id} no existe`,
                        field: 'id'
                    }
                ], `La etapa con ID ${id} no existe`);
            }

            const entityData = {
                ...updateDto,
                AppointmentId: appointmentId || existingEntity.AppointmentId
            };
            
            Object.assign(existingEntity, entityData);
            return await this.appointmentStageRepository.save(existingEntity);
            
        } catch (error) {
            if (error instanceof NotFoundException || 
                error instanceof BadRequestException || 
                error instanceof ConflictException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_ACTUALIZACION_ETAPA',
                    message: `Error al actualizar etapa: ${error.message || 'Error desconocido'}`,
                    field: 'appointmentStage'
                }],
                'Error al actualizar etapa'
            );
        }
    }

    async updateMany(queryRunner: QueryRunner, appointmentId: number, stages: UpdateAppointmentStageDto[]): Promise<AppointmentStageEntity[]> {
        try {
            const appointment = await queryRunner.manager.findOne(AppointmentEntity, {
                where: { Id: appointmentId }
            });
            
            if (!appointment) {
                throw new NotFoundException([
                    {
                        code: 'CITA_NO_EXISTE',
                        message: `La cita con ID ${appointmentId} no existe`,
                        field: 'appointmentId'
                    }
                ], `La cita con ID ${appointmentId} no existe`);
            }
            
            await queryRunner.manager.delete(AppointmentStageEntity, { AppointmentId: appointmentId });
            
            const stageEntities: AppointmentStageEntity[] = [];
            
            for (const stage of stages) {
                const entity = this.appointmentStageRepository.create({
                    ...stage,
                    AppointmentId: appointmentId
                });
                
                const savedEntity = await queryRunner.manager.save(entity);
                stageEntities.push(savedEntity);
            }
            
            return stageEntities;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }
            
            throw new BadRequestException(
                [{
                    code: 'ERROR_ACTUALIZACION_ETAPAS',
                    message: `Error al actualizar etapas: ${error.message || 'Error desconocido'}`,
                    field: 'appointmentStage'
                }],
                'Error al actualizar etapas'
            );
        }
    }
}