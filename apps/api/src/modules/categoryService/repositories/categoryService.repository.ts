import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryServiceEntity } from '../entities/categoryService.entity';
import { CreateCategoryServiceDto } from '../dto/categoryServiceCreate.dto';
import { UpdateCategoryServiceDto } from '../dto/categoryServiceUpdate.dto';
import { ICrudRepository } from '../../../shared/interfaces/crud.interface';

@Injectable()
export class CategoryServiceRepository implements ICrudRepository<CategoryServiceEntity, CreateCategoryServiceDto, UpdateCategoryServiceDto> {
    constructor(
        @InjectRepository(CategoryServiceEntity)
        private readonly categoryServiceRepository: Repository<CategoryServiceEntity>
    ) {}

    async findAll(filters?: Record<string, any>): Promise<CategoryServiceEntity[]> {
        return await this.categoryServiceRepository.find(filters ? { where: filters } : undefined);
    }

    async findOne(id: number): Promise<CategoryServiceEntity | null> {
        return await this.categoryServiceRepository.findOne({ where: { Id: id } });
    }

    async create(data: CreateCategoryServiceDto): Promise<CategoryServiceEntity> {
        const entity = this.categoryServiceRepository.create(data as any);
        const saved = await this.categoryServiceRepository.save(entity);
        return saved as unknown as CategoryServiceEntity;
    }

    async update(id: number, data: UpdateCategoryServiceDto): Promise<CategoryServiceEntity> {
        await this.categoryServiceRepository.update(id, data);
        const updated = await this.findOne(id);
        if (!updated) {
            throw new NotFoundException(`CategoryService with ID ${id} not found`);
        }
        return updated;
    }

    async remove(id: number): Promise<void> {
        const entity = await this.findOne(id);
        if (!entity) {
            throw new NotFoundException(`CategoryService with ID ${id} not found`);
        }
        await this.categoryServiceRepository.remove(entity);
    }
}
