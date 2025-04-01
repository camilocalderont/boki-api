import { Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { ICrudService } from '../interfaces/crud.interface';

export abstract class BaseCrudController<T> {
  constructor(
    protected readonly service: ICrudService<T>,
    protected readonly entityName: string
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any): Promise<T> {
    return await this.service.create(createDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query?: any): Promise<T[]> {
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
    @Body() updateDto: any
  ): Promise<T> {
    return await this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}