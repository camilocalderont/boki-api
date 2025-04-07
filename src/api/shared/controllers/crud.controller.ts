import { Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { ICrudService } from '../interfaces/crud.interface';

export abstract class BaseCrudController<T, CreateDto = any, UpdateDto = any> {
  constructor(
    protected readonly service: ICrudService<T, CreateDto, UpdateDto>,
    protected readonly entityName: string
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateDto): Promise<T> {
    return await this.service.create(createDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query?: Record<string, any>): Promise<T[]> {
    const filters = {};
    if (query) {
      Object.keys(query).forEach(key => {
        if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
          filters[key] = query[key];
        }
      });
    }
    return await this.service.findAll(Object.keys(filters).length ? filters : undefined);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<T> {
    return await this.service.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDto
  ): Promise<{ message: string; data: T }> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException(`Invalid ID: ${id}. ID must be a positive number.`);
    }

    const updated = await this.service.update(id, updateDto);
    return {
      message: `${this.entityName} updated successfully`,
      data: updated
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.service.remove(id);
    return {
      message: `${this.entityName} deleted successfully`
    };
  }
}