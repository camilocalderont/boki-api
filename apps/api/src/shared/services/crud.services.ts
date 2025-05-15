import { NotFoundException, ConflictException, BadRequestException, Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { ICrudService } from '../interfaces/crud.interface';

@Injectable()
export abstract class BaseCrudService<T extends { Id?: number }, CreateDto = any, UpdateDto = any> implements ICrudService<T, CreateDto, UpdateDto> {
  constructor(protected readonly repository: Repository<T>) { }

  async create(createDto: CreateDto): Promise<T> {
    try {
      await this.validateCreate(createDto);

      const entity = this.repository.create(createDto as unknown as DeepPartial<T>);
      const savedEntity = await this.repository.save(entity as DeepPartial<T>);

      await this.afterCreate(savedEntity as T);

      return savedEntity;
    } catch (error) {
      console.error(`Error in create:`, error);
      throw error;
    }
  }

  protected async validateCreate(createDto: CreateDto): Promise<void> {
  }

  protected async afterCreate(entity: T): Promise<void> {
  }

  async findAll(filters?: Record<string, any>): Promise<T[]> {
    try {
      return await this.repository.find(filters ? { where: filters } : {});
    } catch (error) {
      console.error(`Error in findAll:`, error);
      throw error;
    }
  }

  async findOne(id: number): Promise<T> {
    try {
      const entity = await this.repository.findOne({ where: { Id: id } as any });
      if (!entity) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }
      return entity;
    } catch (error) {
      console.error(`Error in findOne:`, error);
      throw error;
    }
  }

  async update(id: number, updateDto: UpdateDto): Promise<T> {
    try {
      await this.validateUpdate(id, updateDto);

      const entity = await this.findOne(id);

      const preparedData = await this.prepareUpdateData(entity, updateDto);

      Object.assign(entity, preparedData as unknown as DeepPartial<T>);

      const updatedEntity = await this.repository.save(entity as DeepPartial<T>);

      await this.afterUpdate(updatedEntity);

      return updatedEntity;
    } catch (error) {
      console.error(`Error in update:`, error);
      throw error;
    }
  }

  protected async validateUpdate(id: number, updateDto: UpdateDto): Promise<void> {
  }

  protected async prepareUpdateData(entity: T, updateDto: UpdateDto): Promise<Partial<T> | UpdateDto> {
    return updateDto;
  }

  protected async afterUpdate(entity: T): Promise<void> {
  }

  async remove(id: number): Promise<void> {
    try {
      const entity = await this.findOne(id);
      await this.repository.remove(entity);
    } catch (error) {
      console.error(`Error in remove:`, error);
      throw error;
    }
  }
}