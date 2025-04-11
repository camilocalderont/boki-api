import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/serviceCreate.dto';
import { UpdateServiceDto } from '../dto/serviceUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';

@Injectable()
export class ServiceService extends BaseCrudService<ServiceEntity, CreateServiceDto, UpdateServiceDto> {
    constructor(
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>
    ) {
        super(serviceRepository);
    }

    protected async validateCreate(createServiceDto: CreateServiceDto): Promise<void> {
        if (!createServiceDto.VcName) {
            throw new BadRequestException('Service name is required');
        }
        
        // Verify if minimal price is less than or equal to maximal price
        if (createServiceDto.IMinimalPrice > createServiceDto.IMaximalPrice) {
            throw new BadRequestException('Minimal price cannot be greater than maximal price');
        }

        // Verify if regular price is within the range of minimal and maximal price
        if (createServiceDto.IRegularPrice < createServiceDto.IMinimalPrice || createServiceDto.IRegularPrice > createServiceDto.IMaximalPrice) {
            throw new BadRequestException('Regular price must be within the range of minimal and maximal price');
        }

        // Check if company exists
        try {
            // We can use the query builder to check if a company with this id exists
            const companyExists = await this.serviceRepository.manager
                .query('SELECT 1 FROM "Company" WHERE "Id" = $1', [createServiceDto.CompanyId]);
            
            if (!companyExists || companyExists.length === 0) {
                throw new NotFoundException(`Company with ID ${createServiceDto.CompanyId} not found`);
            }

            // Check if category exists
            const categoryExists = await this.serviceRepository.manager
                .query('SELECT 1 FROM "CategoryService" WHERE "Id" = $1', [createServiceDto.CategoryId]);
                
            if (!categoryExists || categoryExists.length === 0) {
                throw new NotFoundException(`Category with ID ${createServiceDto.CategoryId} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error validating company or category');
        }
    }

    async create(createServiceDto: CreateServiceDto): Promise<ServiceEntity> {
        try {
            await this.validateCreate(createServiceDto);
            
            return await super.create(createServiceDto);
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException('A service with this data already exists');
            }

            // Handle foreign key constraint errors with more specific messages
            if (error.code === '23503') { // Foreign key constraint error
                if (error.detail?.includes('company_id')) {
                    throw new NotFoundException(`Company with ID ${createServiceDto.CompanyId} not found`);
                }
                if (error.detail?.includes('category_id')) {
                    throw new NotFoundException(`Category with ID ${createServiceDto.CategoryId} not found`);
                }
                throw new BadRequestException(`Foreign key constraint error: ${error.detail}`);
            }

            console.error('Error in create:', error);
            throw new BadRequestException(`Error creating the service: ${error.message}`);
        }
    }

    protected async validateUpdate(id: number, updateServiceDto: UpdateServiceDto): Promise<void> {
        try {
            const service = await this.findOne(id);

            // If updating prices, validate them
            const minPrice = updateServiceDto.IMinimalPrice !== undefined ? updateServiceDto.IMinimalPrice : service.IMinimalPrice;
            const maxPrice = updateServiceDto.IMaximalPrice !== undefined ? updateServiceDto.IMaximalPrice : service.IMaximalPrice;
            const regPrice = updateServiceDto.IRegularPrice !== undefined ? updateServiceDto.IRegularPrice : service.IRegularPrice;

            if (minPrice > maxPrice) {
                throw new BadRequestException('Minimal price cannot be greater than maximal price');
            }

            if (regPrice < minPrice || regPrice > maxPrice) {
                throw new BadRequestException('Regular price must be within the range of minimal and maximal price');
            }
            
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Error validating service update');
        }
    }

    async update(id: number, updateServiceDto: UpdateServiceDto): Promise<ServiceEntity> {
        try {
            await this.validateUpdate(id, updateServiceDto);
            
            const existingEntity = await this.findOne(id);
            
            // Update fields that are included in the DTO
            if (updateServiceDto.VcName !== undefined) {
                existingEntity.VcName = updateServiceDto.VcName;
            }
            if (updateServiceDto.VcDescription !== undefined) {
                existingEntity.VcDescription = updateServiceDto.VcDescription;
            }
            if (updateServiceDto.IMinimalPrice !== undefined) {
                existingEntity.IMinimalPrice = updateServiceDto.IMinimalPrice;
            }
            if (updateServiceDto.IMaximalPrice !== undefined) {
                existingEntity.IMaximalPrice = updateServiceDto.IMaximalPrice;
            }
            if (updateServiceDto.IRegularPrice !== undefined) {
                existingEntity.IRegularPrice = updateServiceDto.IRegularPrice;
            }
            if (updateServiceDto.DTaxes !== undefined) {
                existingEntity.DTaxes = updateServiceDto.DTaxes;
            }
            if (updateServiceDto.VcTime !== undefined) {
                existingEntity.VcTime = updateServiceDto.VcTime;
            }
            if (updateServiceDto.CompanyId !== undefined) {
                existingEntity.CompanyId = updateServiceDto.CompanyId;
            }
            if (updateServiceDto.CategoryId !== undefined) {
                existingEntity.CategoryId = updateServiceDto.CategoryId;
            }
            
            return await this.serviceRepository.save(existingEntity);
        } catch (error) {
            console.error('Error in update:', error);
            if (error instanceof NotFoundException || 
                error instanceof ConflictException || 
                error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Error updating the service');
        }
    }

    async findByCompany(companyId: number): Promise<ServiceEntity[]> {
        return this.serviceRepository.find({
            where: { CompanyId: companyId },
            relations: ['Category']
        });
    }

    async findByCategory(categoryId: number): Promise<ServiceEntity[]> {
        return this.serviceRepository.find({
            where: { CategoryId: categoryId },
            relations: ['Company']
        });
    }
}
