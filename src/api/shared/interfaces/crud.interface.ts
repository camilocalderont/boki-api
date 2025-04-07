export interface ICrudRepository<T, CreateDto = any, UpdateDto = any> {
  create(data: CreateDto): Promise<T>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  findOne(id: number): Promise<T | null>;
  update(id: number, data: UpdateDto): Promise<T>;
  remove(id: number): Promise<void>;
}

export interface ICrudService<T, CreateDto = any, UpdateDto = any> {
  create(createDto: CreateDto): Promise<T>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  findOne(id: number): Promise<T>;
  update(id: number, updateDto: UpdateDto): Promise<T>;
  remove(id: number): Promise<void>;
}