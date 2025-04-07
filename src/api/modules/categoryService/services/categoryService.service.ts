import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryServiceEntity } from '../entities/categoryService.entity';
import { CreateCategoryServiceDto } from '../dto/categoryServiceCreate.dto';
import { UpdateCategoryServiceDto } from '../dto/categoryServiceUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';

@Injectable()
export class CategoryServiceService extends BaseCrudService<CategoryServiceEntity, CreateCategoryServiceDto, UpdateCategoryServiceDto> {
    constructor(
        @InjectRepository(CategoryServiceEntity)
        private readonly categoryServiceRepository: Repository<CategoryServiceEntity>
    ) {
        super(categoryServiceRepository);
    }

    protected async validateCreate(createCategoryServiceDto: CreateCategoryServiceDto): Promise<void> {
        if (!createCategoryServiceDto.VcName) {
            throw new BadRequestException('Category name is required');
        }
        
        const existingName = await this.categoryServiceRepository.findOne({
            where: { VcName: createCategoryServiceDto.VcName }
        });

        if (existingName) {
            throw new ConflictException('A service category with this name already exists');
        }
    }

    async create(createCategoryServiceDto: CreateCategoryServiceDto): Promise<CategoryServiceEntity> {
        try {
            await this.validateCreate(createCategoryServiceDto);
            
            return await super.create(createCategoryServiceDto);
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException('A service category with this data already exists');
            }

            console.error('Error in create:', error);
            throw new BadRequestException('Error creating the service category');
        }
    }

    protected async validateUpdate(id: number, updateCategoryServiceDto: UpdateCategoryServiceDto): Promise<void> {
        try {
            const categoryService = await this.findOne(id);
            
            if (updateCategoryServiceDto.VcName && updateCategoryServiceDto.VcName !== categoryService.VcName) {
                const existingName = await this.categoryServiceRepository.findOne({
                    where: { VcName: updateCategoryServiceDto.VcName }
                });

                if (existingName && existingName.Id !== id) {
                    throw new ConflictException('This name is already in use by another service category');
                }
            }
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Error validating service category update');
        }
    }

    async update(id: number, updateCategoryServiceDto: UpdateCategoryServiceDto): Promise<CategoryServiceEntity> {
        try {
            await this.validateUpdate(id, updateCategoryServiceDto);
            
            const existingEntity = await this.findOne(id);
            
            if (updateCategoryServiceDto.VcName !== undefined) {
                existingEntity.VcName = updateCategoryServiceDto.VcName;
            }
            
            return await this.categoryServiceRepository.save(existingEntity);
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof NotFoundException || 
                error instanceof ConflictException || 
                error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Error updating the service category');
        }
    }
}
