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

      // Obtener documento limpio con lean()
      const doc = await this.repository.findById(savedEntity._id).lean().exec();
      return this.transformMongoDocument(doc);
    } catch (error) {
      console.error(`Error in create:`, error);
      
      if (error.code === 11000) { // Clave duplicada en MongoDB
        throw new ConflictException('Ya existe un registro con estos datos');
      }
      
      throw error;
    }
  }

  protected async afterCreate(entity: T): Promise<void> {
    // Método a sobrescribir en las clases hijas
  }

  async findAll(filters?: Record<string, any>): Promise<T[]> {
    try {
      const results = await this.repository.find(filters || {}).lean().exec();
      return results.map(doc => this.transformMongoDocument(doc));
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
          .lean()
          .exec(),
        this.repository.countDocuments(filters || {}).exec()
      ]);

      const transformedItems = items.map(item => this.transformMongoDocument(item));

      return {
        items: transformedItems,
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
      // Validar si el ID es un ObjectId válido
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new NotFoundException(`El ID "${id}" no es válido. Debe ser un ID de 24 caracteres hexadecimales`);
      }

      const entity = await this.repository.findById(id).lean().exec();
      if (!entity) {
        throw new NotFoundException(`Entidad con ID ${id} no encontrada`);
      }
      return this.transformMongoDocument(entity);
    } catch (error) {
      console.error(`Error in findOne:`, error);
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateDto): Promise<T> {
    try {
      // Validar si el ID es un ObjectId válido
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new NotFoundException(`El ID "${id}" no es válido. Debe ser un ID de 24 caracteres hexadecimales`);
      }

      await this.validateUpdate(id, updateDto);

      const entity = await this.findOne(id);
      const preparedData = await this.prepareUpdateData(entity, updateDto);

      await this.repository.findByIdAndUpdate(id, preparedData).exec();
      await this.afterUpdate(await this.repository.findById(id).exec());

      // Obtener documento actualizado limpio
      const updated = await this.repository.findById(id).lean().exec();
      return this.transformMongoDocument(updated);
    } catch (error) {
      console.error(`Error in update:`, error);
      throw error;
    }
  }

  protected async validateUpdate(id: string, updateDto: UpdateDto): Promise<void> {
    // Método a sobrescribir en las clases hijas
  }

  protected async validateCreate(createDto: CreateDto): Promise<void> {
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
      // Validar si el ID es un ObjectId válido
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new NotFoundException(`El ID "${id}" no es válido. Debe ser un ID de 24 caracteres hexadecimales`);
      }

      const result = await this.repository.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Entidad con ID ${id} no encontrada`);
      }
    } catch (error) {
      console.error(`Error in remove:`, error);
      throw error;
    }
  }

  // Método para transformar documentos MongoDB a objetos limpios
  public transformMongoDocument(doc: any): any {
    if (!doc) return null;
    
    const transformed = { ...doc };
    
    // Convertir ObjectId a string
    if (transformed._id) {
      transformed._id = transformed._id.toString();
    }
    
    // Convertir fechas a formato ISO
    if (transformed.lastInteraction && transformed.lastInteraction instanceof Date) {
      transformed.lastInteraction = transformed.lastInteraction.toISOString();
    }
    
    if (transformed.createdAt && transformed.createdAt instanceof Date) {
      transformed.createdAt = transformed.createdAt.toISOString();
    }
    
    if (transformed.updatedAt && transformed.updatedAt instanceof Date) {
      transformed.updatedAt = transformed.updatedAt.toISOString();
    }
    
    return transformed;
  }
}