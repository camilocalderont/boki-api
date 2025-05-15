import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { AppointmentStateEntity } from '../entities/appointmentState.entity';
import { CreateAppointmentStateDto } from '../dto/appointmentStateCreate.dto';
import { UpdateAppointmentStateDto } from '../dto/appointmentStateUpdate.dto';
import { AppointmentEntity } from '../entities/appointment.entity';
import { StateEntity } from '../entities/state.entity';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class AppointmentStateService {
    constructor(
        @InjectRepository(AppointmentStateEntity)
        private readonly appointmentStateRepository: Repository<AppointmentStateEntity>,
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepository: Repository<AppointmentEntity>,
        @InjectRepository(StateEntity)
        private readonly stateRepository: Repository<StateEntity>
    ) {}

    protected async validateCreate(createDto: CreateAppointmentStateDto, appointmentId: number): Promise<void> {
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

        if (createDto.StateId) {
            const state = await this.stateRepository.findOne({
                where: { Id: createDto.StateId }
            });

            if (!state) {
                errors.push({
                    code: 'ESTADO_NO_EXISTE',
                    message: `El estado con ID ${createDto.StateId} no existe`,
                    field: 'StateId'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, 'Error en la validación del estado');
        }
    }

    async create(createDto: CreateAppointmentStateDto, appointmentId: number): Promise<AppointmentStateEntity> {
        try {
            await this.validateCreate(createDto, appointmentId);

            const entityData = {
                ...createDto,
                AppointmentId: appointmentId,
                DtDateTime: createDto.DtDateTime || new Date()
            };
            
            const entity = this.appointmentStateRepository.create(entityData);
            return await this.appointmentStateRepository.save(entity);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23503') {
                throw new BadRequestException(
                    [{
                        code: 'RELACION_INVALIDA',
                        message: 'Una o más relaciones especificadas no existen',
                        field: 'appointmentState'
                    }],
                    'Una o más relaciones especificadas no existen'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_ESTADO',
                    message: `Error al crear estado: ${error.message || 'Error desconocido'}`,
                    field: 'appointmentState'
                }],
                'Error al crear estado'
            );
        }
    }

    async createMany(queryRunner: QueryRunner, appointmentId: number, states: CreateAppointmentStateDto[]): Promise<AppointmentStateEntity[]> {
        try {
            const stateEntities: AppointmentStateEntity[] = [];

            for (const state of states) {
                const entityData = {
                    ...state,
                    AppointmentId: appointmentId,
                    DtDateTime: state.DtDateTime || new Date()
                };
                
                const entity = this.appointmentStateRepository.create(entityData);
                const savedEntity = await queryRunner.manager.save(entity);
                stateEntities.push(savedEntity);
            }

            return stateEntities;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_ESTADOS',
                    message: `Error al crear estados: ${error.message || 'Error desconocido'}`,
                    field: 'appointmentState'
                }],
                'Error al crear estados'
            );
        }
    }

    protected async validateUpdate(id: number, updateDto: UpdateAppointmentStateDto, appointmentId?: number): Promise<void> {
        const errors: ApiErrorItem[] = [];

        const existingState = await this.appointmentStateRepository.findOne({
            where: { Id: id }
        });

        if (!existingState) {
            throw new NotFoundException([
                {
                    code: 'ESTADO_CITA_NO_EXISTE',
                    message: `El estado de cita con ID ${id} no existe`,
                    field: 'id'
                }
            ], `El estado de cita con ID ${id} no existe`);
        }

        if (appointmentId && appointmentId !== existingState.AppointmentId) {
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

        if (updateDto.StateId && updateDto.StateId !== existingState.StateId) {
            const state = await this.stateRepository.findOne({
                where: { Id: updateDto.StateId }
            });
            
            if (!state) {
                errors.push({
                    code: 'ESTADO_NO_EXISTE',
                    message: `El estado con ID ${updateDto.StateId} no existe`,
                    field: 'StateId'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, 'Error en la validación del estado de la cita');
        }
    }

    async update(id: number, updateDto: UpdateAppointmentStateDto, appointmentId?: number): Promise<AppointmentStateEntity> {
        try {
            await this.validateUpdate(id, updateDto, appointmentId);
            
            const existingEntity = await this.appointmentStateRepository.findOne({
                where: { Id: id }
            });

            if (!existingEntity) {
                throw new NotFoundException([
                    {
                        code: 'ESTADO_CITA_NO_EXISTE',
                        message: `El estado de cita con ID ${id} no existe`,
                        field: 'id'
                    }
                ], `El estado de cita con ID ${id} no existe`);
            }

            const entityData = {
                ...updateDto,
                AppointmentId: appointmentId || existingEntity.AppointmentId,
                DtDateTime: updateDto.DtDateTime || existingEntity.DtDateTime
            };

            Object.assign(existingEntity, entityData);
            return await this.appointmentStateRepository.save(existingEntity);
            
        } catch (error) {
            if (error instanceof NotFoundException || 
                error instanceof BadRequestException || 
                error instanceof ConflictException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_ACTUALIZACION_ESTADO',
                    message: `Error al actualizar estado: ${error.message || 'Error desconocido'}`,
                    field: 'appointmentState'
                }],
                'Error al actualizar estado'
            );
        }
    }

    async addAppointmentState(queryRunner: QueryRunner, appointmentId: number, stateDto: UpdateAppointmentStateDto): Promise<AppointmentStateEntity[]> {
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
            
            if (stateDto.StateId) {
                const state = await queryRunner.manager.findOne(StateEntity, {
                    where: { Id: stateDto.StateId }
                });
                
                if (!state) {
                    throw new NotFoundException([
                        {
                            code: 'ESTADO_NO_EXISTE',
                            message: `El estado con ID ${stateDto.StateId} no existe`,
                            field: 'stateId'
                        }
                    ], `El estado con ID ${stateDto.StateId} no existe`);
                }
            }
            
            const entityData = {
                ...stateDto,
                AppointmentId: appointmentId,
                DtDateTime: stateDto.DtDateTime || new Date()
            };
            
            const entity = this.appointmentStateRepository.create(entityData);
            await queryRunner.manager.save(entity);
            
            const allStates = await queryRunner.manager.find(AppointmentStateEntity, {
                where: { AppointmentId: appointmentId },
                order: { DtDateTime: 'DESC' },
                relations: ['State']
            });
            
            return allStates;
        } catch (error) {
            if (error instanceof NotFoundException || 
                error instanceof BadRequestException || 
                error instanceof ConflictException) {
                throw error;
            }
            
            throw new BadRequestException(
                [{
                    code: 'ERROR_REGISTRO_ESTADO',
                    message: `Error al registrar el estado: ${error.message || 'Error desconocido'}`,
                    field: 'appointmentState'
                }],
                'Error al registrar el estado'
            );
        }
    }
}