import { Model, Document } from 'mongoose';
import { NotFoundException, ConflictException, BadRequestException, Injectable } from '@nestjs/common';
import { IMongoDbCrudService } from '../interfaces/mongo-crud.interface';
import { PaginatedResponse, PaginationOptions } from '../interfaces/mongo-pagination.interface';

@Injectable()
export abstract class BaseMongoDbCrudService<T extends Document, CreateDto = any, UpdateDto = any> 
  implements IMongoDbCrudService<T, CreateDto, UpdateDto> {
  
  constructor(protected readonly repository: Model<T>) { }

  async create(createDto: CreateDto): Promise<T> {
    try {
      await this.validateCreate(createDto);

      const entity = new this.repository(createDto);
      const savedEntity = await entity.save();

      await this.afterCreate(savedEntity);

      return savedEntity;
    } catch (error) {
      console.error(`Error in create:`, error);
      
      if (error.code === 11000) { // Clave duplicada en MongoDB
        throw new ConflictException('Ya existe un registro con estos datos');
      }
      
      throw error;
    }
  }

  protected async validateCreate(createDto: CreateDto): Promise<void> {
    // Método a sobrescribir en las clases hijas
  }

  protected async afterCreate(entity: T): Promise<void> {
    // Método a sobrescribir en las clases hijas
  }

  async findAll(filters?: Record<string, any>): Promise<T[]> {
    try {
      return await this.repository.find(filters || {}).exec();
    } catch (error) {
      console.error(`Error in findAll:`, error);
      throw error;
    }
  }

  async findAllPaginated(
    options: PaginationOptions = { page: 1, limit: 10 },
    filters?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;
      const sort = options.sort || { createdAt: -1 };

      const [items, totalItems] = await Promise.all([
        this.repository
          .find(filters || {})
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.repository.countDocuments(filters || {}).exec()
      ]);

      return {
        items,
        meta: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page
        }
      };
    } catch (error) {
      console.error(`Error in findAllPaginated:`, error);
      throw error;
    }
  }

  async findOne(id: string): Promise<T> {
    try {
      const entity = await this.repository.findById(id).exec();
      if (!entity) {
        throw new NotFoundException(`Entidad con ID ${id} no encontrada`);
      }
      return entity;
    } catch (error) {
      console.error(`Error in findOne:`, error);
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateDto): Promise<T> {
    try {
      await this.validateUpdate(id, updateDto);

      const entity = await this.findOne(id);
      const preparedData = await this.prepareUpdateData(entity, updateDto);

      Object.assign(entity, preparedData);
      const updatedEntity = await entity.save();

      await this.afterUpdate(updatedEntity);

      return updatedEntity;
    } catch (error) {
      console.error(`Error in update:`, error);
      throw error;
    }
  }

  protected async validateUpdate(id: string, updateDto: UpdateDto): Promise<void> {
    // Método a sobrescribir en las clases hijas
  }

  protected async prepareUpdateData(entity: T, updateDto: UpdateDto): Promise<Partial<T> | UpdateDto> {
    return updateDto;
  }

  protected async afterUpdate(entity: T): Promise<void> {
    // Método a sobrescribir en las clases hijas
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.repository.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Entidad con ID ${id} no encontrada`);
      }
    } catch (error) {
      console.error(`Error in remove:`, error);
      throw error;
    }
  }
}