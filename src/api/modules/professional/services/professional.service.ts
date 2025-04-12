import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalEntity } from '../entities/professional.entity';
import { CreateProfessionalDto } from '../dto/professionalCreate.dto';
import { UpdateProfessionalDto } from '../dto/professionalUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';

@Injectable()
export class ProfessionalService extends BaseCrudService<ProfessionalEntity, CreateProfessionalDto, UpdateProfessionalDto> {
    constructor(
        @InjectRepository(ProfessionalEntity)
        private readonly professionalRepository: Repository<ProfessionalEntity>
    ) {
        super(professionalRepository);
    }

    protected async validateCreate(createProfessionalDto: CreateProfessionalDto): Promise<void> {
        const existingEmail = await this.professionalRepository.findOne({
            where: { VcEmail: createProfessionalDto.VcEmail }
        });

        if (existingEmail) {
            throw new ConflictException('A professional with this email already exists');
        }

        const existingId = await this.professionalRepository.findOne({
            where: { VcIdentificationNumber: createProfessionalDto.VcIdentificationNumber }
        });

        if (existingId) {
            throw new ConflictException('A professional with this identification number already exists');
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
            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException('A professional with this data already exists');
            }

            console.error('Error in create:', error);
            throw error;
        }
    }

    protected async validateUpdate(id: number, updateProfessionalDto: UpdateProfessionalDto): Promise<void> {
        try {
            const professional = await this.findOne(id);
            
            if (updateProfessionalDto.VcEmail && updateProfessionalDto.VcEmail !== professional.VcEmail) {
                const existingEmail = await this.professionalRepository.findOne({
                    where: { VcEmail: updateProfessionalDto.VcEmail }
                });

                if (existingEmail) {
                    throw new ConflictException('Email is already in use by another professional');
                }
            }
            
            if (updateProfessionalDto.VcIdentificationNumber && 
                updateProfessionalDto.VcIdentificationNumber !== professional.VcIdentificationNumber) {
                const existingId = await this.professionalRepository.findOne({
                    where: { VcIdentificationNumber: updateProfessionalDto.VcIdentificationNumber }
                });

                if (existingId) {
                    throw new ConflictException('Identification number is already in use by another professional');
                }
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Error validating professional with ID ${id}: ${error.message}`);
        }
    }
    
    async update(id: number, updateProfessionalDto: UpdateProfessionalDto): Promise<ProfessionalEntity> {
        try {
            return await super.update(id, updateProfessionalDto);
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
