import { Document } from 'mongoose';

export interface IMongoDbCrudService<T extends Document, CreateDto = any, UpdateDto = any> {
    create(createDto: CreateDto): Promise<T>;
    findAll(filters?: Record<string, any>): Promise<T[]>;
    findOne(id: string): Promise<T>;
    update(id: string, updateDto: UpdateDto): Promise<T>;
    remove(id: string): Promise<void>;
}