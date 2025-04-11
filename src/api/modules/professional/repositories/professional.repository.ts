import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalEntity } from '../entities/professional.entity';
import { CreateProfessionalDto } from '../dto/professionalCreate.dto';
import { UpdateProfessionalDto } from '../dto/professionalUpdate.dto';
import { ICrudRepository } from '../../../shared/interfaces/crud.interface';

@Injectable()
export class ProfessionalRepository implements ICrudRepository<ProfessionalEntity, CreateProfessionalDto, UpdateProfessionalDto> {
    constructor(
        @InjectRepository(ProfessionalEntity)
        private readonly professionalRepository: Repository<ProfessionalEntity>
    ) {}

    async findAll(filters?: Record<string, any>): Promise<ProfessionalEntity[]> {
        return await this.professionalRepository.find(filters ? { where: filters } : undefined);
    }

    async findOne(id: number): Promise<ProfessionalEntity | null> {
        return await this.professionalRepository.findOne({ where: { Id: id } });
    }

    async create(data: CreateProfessionalDto): Promise<ProfessionalEntity> {
        const entity = this.professionalRepository.create(data as any);
        const saved = await this.professionalRepository.save(entity);
        return saved as unknown as ProfessionalEntity;
    }

    async update(id: number, data: UpdateProfessionalDto): Promise<ProfessionalEntity> {
        await this.professionalRepository.update(id, data);
        const updated = await this.findOne(id);
        if (!updated) {
            throw new NotFoundException(`Professional with ID ${id} not found`);
        }
        return updated;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.professionalRepository.delete(id);
        return result.affected > 0;
    }
    
    async remove(id: number): Promise<void> {
        const entity = await this.findOne(id);
        if (!entity) {
            throw new NotFoundException(`Professional with ID ${id} not found`);
        }
        await this.professionalRepository.remove(entity);
    }

    async findByEmail(email: string): Promise<ProfessionalEntity | null> {
        return await this.professionalRepository.findOne({ where: { VcEmail: email } });
    }

    async findByIdentificationNumber(identificationNumber: string): Promise<ProfessionalEntity | null> {
        return await this.professionalRepository.findOne({ where: { VcIdentificationNumber: identificationNumber } });
    }

    async findBySpecialization(specialization: string): Promise<ProfessionalEntity[]> {
        return await this.professionalRepository.find({ where: { VcSpecialization: specialization } });
    }
}
