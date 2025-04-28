import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalEntity } from '../entities/professional.entity';
import { CreateProfessionalDto } from '../dto/professionalCreate.dto';
import { UpdateProfessionalDto } from '../dto/professionalUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';
//mensajes en español
@Injectable()
export class ProfessionalService extends BaseCrudService<ProfessionalEntity, CreateProfessionalDto, UpdateProfessionalDto> {
    constructor(
        @InjectRepository(ProfessionalEntity)
        private readonly professionalRepository: Repository<ProfessionalEntity>
    ) {
        super(professionalRepository);
    }

    protected async validateCreate(createProfessionalDto: CreateProfessionalDto): Promise<void> {
        const errors: ApiErrorItem[] = [];
        const existingEmail = await this.professionalRepository.findOne({
            where: { VcEmail: createProfessionalDto.VcEmail }
        });

        if (existingEmail) {
            errors.push({
                code: 'EMAIL_YA_EXISTE',
                message: 'Ya existe un profesional con este correo electrónico.',
                field: 'VcEmail'
            });
        }

        const existingId = await this.professionalRepository.findOne({
            where: { VcIdentificationNumber: createProfessionalDto.VcIdentificationNumber }
        });

        if (existingId) {
            errors.push({
                code: 'IDENTIFICACION_YA_EXISTE',
                message: 'Ya existe un profesional con este número de identificación.',
                field: 'VcIdentificationNumber'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la creación del profesional");
        }
    }

    async create(createProfessionalDto: CreateProfessionalDto): Promise<ProfessionalEntity> {
        try {
            await this.validateCreate(createProfessionalDto);
            const entity = this.professionalRepository.create(createProfessionalDto);
            const savedEntity = await this.professionalRepository.save(entity);
            await this.afterCreate(savedEntity);
            return savedEntity;

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_PROFESSIONAL',
                        message: 'Ya existe un profesional con estos datos',
                        field: 'professional'
                    }],
                    'Ya existe un profesional con estos datos'
                );
            }

            throw new BadRequestException('Ha ocurrido un error inesperado', error);
        }
    }

    protected async validateUpdate(id: number, updateProfessionalDto: UpdateProfessionalDto): Promise<void> {
        const errors: ApiErrorItem[] = [];

        let professional: ProfessionalEntity;
        try {
            professional = await this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException([
                    {
                        code: 'PROFESSIONAL_NO_EXISTE',
                        message: `El profesional con ID ${id} no existe`,
                        field: 'id'
                    }
                ], `El profesional con ID ${id} no existe`);
            }
            throw error;
        }

        if (updateProfessionalDto.VcEmail && updateProfessionalDto.VcEmail !== professional.VcEmail) {
            const existingEmail = await this.professionalRepository.findOne({
                where: { VcEmail: updateProfessionalDto.VcEmail }
            });

            if (existingEmail) {
                errors.push({
                    code: 'EMAIL_YA_EXISTE',
                    message: 'Ya existe un profesional con este correo electrónico.',
                    field: 'VcEmail'
                });
            }
        }

        if (updateProfessionalDto.VcIdentificationNumber &&
            updateProfessionalDto.VcIdentificationNumber !== professional.VcIdentificationNumber) {
            const existingId = await this.professionalRepository.findOne({
                where: { VcIdentificationNumber: updateProfessionalDto.VcIdentificationNumber }
            });

            if (existingId) {
                errors.push({
                    code: 'IDENTIFICACION_YA_EXISTE',
                    message: 'Ya existe un profesional con este número de identificación.',
                    field: 'VcIdentificationNumber'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la actualización del profesional");
        }
    }

    async update(id: number, updateProfessionalDto: UpdateProfessionalDto): Promise<ProfessionalEntity> {
        try {
            await this.validateUpdate(id, updateProfessionalDto);
            const existingEntity = await this.professionalRepository.findOne({ where: { Id: id } });
            
            Object.assign(existingEntity, updateProfessionalDto);
            const updatedEntity = await this.professionalRepository.save(existingEntity);
            return updatedEntity;
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException('A professional with this data already exists');
            }

            console.error('Error in update:', error);
            throw error;
        }
    }

    async findBySpecialization(specialization: string): Promise<ProfessionalEntity[]> {
        const professionals = await this.professionalRepository.find({
            where: { VcSpecialization: specialization }
        });

        if (!professionals || professionals.length === 0) {
            throw new NotFoundException(`No professionals found with specialization: ${specialization}`);
        }

        return professionals;
    }

    async findByExperienceYears(years: number): Promise<ProfessionalEntity[]> {
        const professionals = await this.professionalRepository.find({
            where: { IYearsOfExperience: years }
        });

        if (!professionals || professionals.length === 0) {
            throw new NotFoundException(`No professionals found with ${years} years of experience`);
        }

        return professionals;
    }
}
