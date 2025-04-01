export interface ICrudRepository<T> {
  create(data: any): Promise<T>;
  findAll(filters?: any): Promise<T[]>;
  findOne(id: number): Promise<T | null>;
  update(id: number, data: Partial<T>): Promise<T>;
  remove(id: number): Promise<void>;
}

export interface ICrudService<T> {
  create(createDto: any): Promise<T>;
  findAll(filters?: any): Promise<T[]>;
  findOne(id: number): Promise<T>;
  update(id: number, updateDto: Partial<any>): Promise<T>;
  remove(id: number): Promise<void>;
}