import { NotFoundException, ConflictException, BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ICrudService } from '../interfaces/crud.interface';

@Injectable()
export abstract class BaseCrudService<T extends { Id?: number }> implements ICrudService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: any): Promise<T> {
    try {
      const entity = this.repository.create(createDto);
      return await this.repository.save(entity as any);
    } catch (error) {
      console.error(`Error in create:`, error);
      throw error;
    }
  }

  async findAll(filters?: any): Promise<T[]> {
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

  async update(id: number, updateDto: Partial<any>): Promise<T> {
    try {
      const entity = await this.findOne(id);
      Object.assign(entity, updateDto);
      return await this.repository.save(entity as any);
    } catch (error) {
      console.error(`Error in update:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const entity = await this.findOne(id);
      await this.repository.remove(entity as any);
    } catch (error) {
      console.error(`Error in remove:`, error);
      throw error;
    }
  }
}