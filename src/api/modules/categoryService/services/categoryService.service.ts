import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryServiceEntity } from '../entities/categoryService.entity';
import { CreateCategoryServiceDto } from '../dto/categoryServiceCreate.dto';
import { UpdateCategoryServiceDto } from '../dto/categoryServiceUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { CategoryServiceRepository } from '../repositories/categoryService.repository';

@Injectable()
export class CategoryServiceService extends BaseCrudService<CategoryServiceEntity, CreateCategoryServiceDto, UpdateCategoryServiceDto> {
    constructor(
        @InjectRepository(CategoryServiceEntity)
        private readonly categoryServiceRepository: Repository<CategoryServiceEntity>,
        @Inject(CategoryServiceRepository)
        private readonly categoryServiceCustomRepository: CategoryServiceRepository
    ) {
        super(categoryServiceRepository);
    }

    protected async validateCreate(createCategoryServiceDto: CreateCategoryServiceDto): Promise<void> {
        if (!createCategoryServiceDto.VcName) {
            throw new BadRequestException('El nombre de la categoría es requerido');
        }

        const existingName = await this.categoryServiceRepository.findOne({
            where: { VcName: createCategoryServiceDto.VcName }
        });

        if (existingName) {
            throw new ConflictException('Ya existe una categoría con este nombre');
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

    async categoriesByCompanyId(companyId: number): Promise<CategoryServiceEntity[]> {
        try {
            const categories = await this.categoryServiceCustomRepository.findByCompanyId(companyId);

            if (!categories || categories.length === 0) {
                throw new ConflictException(
                    [{
                        code: 'NO_CATEGORIES_FOUND',
                        message: `No se encontraron categorías para la empresa ID ${companyId}`,
                        field: 'companyId'
                    }],
                    'No se encontraron categorías para esta empresa'
                );
            }

            return categories;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Error buscando categorías por ID de empresa');
        }
    }

    async categoriesByCompanyIdForLLM(companyId: number): Promise<{ Id: number; VcName: string }[]> {
        try {
            const categories = await this.categoryServiceCustomRepository.findByCompanyIdForLLM(companyId);

            if (!categories || categories.length === 0) {
                throw new ConflictException(
                    [{
                        code: 'NO_CATEGORIES_FOUND',
                        message: `No se encontraron categorías para la empresa ID ${companyId}`,
                        field: 'companyId'
                    }],
                    'No se encontraron categorías para esta empresa'
                );
            }

            return categories;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException('Error buscando categorías por ID de empresa');
        }
    }
}
