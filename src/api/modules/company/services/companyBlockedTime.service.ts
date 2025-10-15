import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { CompanyBlockedTimeEntity } from '../entities/companyBlockedTime.entity';
import { CreateCompanyBlockedTimeDto } from '../dto/companyBlockedTimeCreate.dto';
import { UpdateCompanyBlockedTimeDto } from '../dto/companyBlockedTimeUpdate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { CompanyBlockedTimeRepository } from '../repositories/companyBlockedTime.repository';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class CompanyBlockedTimeService extends BaseCrudService<CompanyBlockedTimeEntity, CreateCompanyBlockedTimeDto, UpdateCompanyBlockedTimeDto> {
    constructor(
        @InjectRepository(CompanyBlockedTimeEntity)
        private readonly companyBlockedTimeEntityRepository: Repository<CompanyBlockedTimeEntity>,
        @Inject(CompanyBlockedTimeRepository)
        private readonly companyBlockedTimeRepository: CompanyBlockedTimeRepository
    ) {
        super(companyBlockedTimeEntityRepository);
    }

    protected async validateCreate(createDto: CreateCompanyBlockedTimeDto): Promise<void> {
        const errors: ApiErrorItem[] = [];

        if (new Date(createDto.DtInitDate) >= new Date(createDto.DtEndDate)) {
            errors.push({
                code: 'FECHAS_INVALIDAS',
                message: 'La fecha de inicio debe ser anterior a la fecha de fin.',
                field: 'DtInitDate'
            });
        }

        const existingBlockedTimes = await this.companyBlockedTimeEntityRepository.find({
            where: [
                {
                    CompanyId: createDto.CompanyId,
                    DtInitDate: LessThanOrEqual(createDto.DtEndDate),
                    DtEndDate: MoreThanOrEqual(createDto.DtInitDate)
                }
            ]
        });

        if (existingBlockedTimes.length > 0) {
            errors.push({
                code: 'SUPERPOSICION_HORARIO_BLOQUEADO',
                message: 'Ya existe un horario bloqueado que se superpone con las fechas proporcionadas.',
                field: 'DtInitDate'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la creación del horario bloqueado");
        }
    }

    protected async validateUpdate(id: number, updateDto: UpdateCompanyBlockedTimeDto): Promise<void> {
        const errors: ApiErrorItem[] = [];
        
        let blockedTime: CompanyBlockedTimeEntity;
        try {
            blockedTime = await this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException([{
                    code: 'HORARIO_BLOQUEADO_NO_EXISTE',
                    message: `El horario bloqueado con ID ${id} no existe`,
                    field: 'id'
                }], `El horario bloqueado con ID ${id} no existe`);
            }
            throw error;
        }

        if (updateDto.DtInitDate && updateDto.DtEndDate &&
            new Date(updateDto.DtInitDate) >= new Date(updateDto.DtEndDate)) {
            errors.push({
                code: 'FECHAS_INVALIDAS',
                message: 'La fecha de inicio debe ser anterior a la fecha de fin.',
                field: 'DtInitDate'
            });
        }

        const initDate = updateDto.DtInitDate || blockedTime.DtInitDate;
        const endDate = updateDto.DtEndDate || blockedTime.DtEndDate;

        const existingBlockedTimes = await this.companyBlockedTimeEntityRepository.find({
            where: [
                {
                    CompanyId: updateDto.CompanyId || blockedTime.CompanyId,
                    DtInitDate: LessThanOrEqual(endDate),
                    DtEndDate: MoreThanOrEqual(initDate),
                    Id: Not(id)
                }
            ]
        });

        if (existingBlockedTimes.length > 0) {
            errors.push({
                code: 'SUPERPOSICION_HORARIO_BLOQUEADO',
                message: 'Ya existe un horario bloqueado que se superpone con las fechas proporcionadas.',
                field: 'DtInitDate'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la actualización del horario bloqueado");
        }
    }

    async create(createDto: CreateCompanyBlockedTimeDto): Promise<CompanyBlockedTimeEntity> {
        try {
            await this.validateCreate(createDto);
            
            const entity = this.companyBlockedTimeEntityRepository.create(createDto);
            const savedEntity = await this.companyBlockedTimeEntityRepository.save(entity);
            
            return savedEntity;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_HORARIO_BLOQUEADO',
                        message: 'Ya existe un horario bloqueado con estos datos',
                        field: 'blockedTime'
                    }],
                    'Ya existe un horario bloqueado con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_HORARIO_BLOQUEADO',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'blockedTime'
                }],
                'Ha ocurrido un error inesperado'
            );
        }
    }

    async update(id: number, updateDto: UpdateCompanyBlockedTimeDto): Promise<CompanyBlockedTimeEntity> {
        try {
            await this.validateUpdate(id, updateDto);
            return await super.update(id, updateDto);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_HORARIO_BLOQUEADO',
                        message: 'Ya existe un horario bloqueado con estos datos',
                        field: 'blockedTime'
                    }],
                    'Ya existe un horario bloqueado con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_ACTUALIZACION_HORARIO_BLOQUEADO',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'blockedTime'
                }],
                'Ha ocurrido un error inesperado'
            );
        }
    }

    async findByCompany(companyId: number): Promise<CompanyBlockedTimeEntity[]> {
        return this.companyBlockedTimeEntityRepository.find({
            where: { CompanyId: companyId },
            order: { DtInitDate: 'ASC' }
        });
    }

    async hasActiveBlockedTime(companyId: number, date: Date): Promise<boolean> {
        const blockedTimes = await this.companyBlockedTimeEntityRepository.find({
            where: {
                CompanyId: companyId,
                DtInitDate: LessThanOrEqual(date),
                DtEndDate: MoreThanOrEqual(date)
            }
        });

        return blockedTimes.length > 0;
    }
}