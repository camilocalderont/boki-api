import { Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, ParseIntPipe, Query, BadRequestException, UsePipes } from '@nestjs/common';
import { ICrudService } from '../interfaces/crud.interface';
import { Schema } from 'joi';
import { UseJoiValidationPipe } from '../utils/pipes/use-joi.pipe';
import { ApiControllerResponse } from '../interfaces/api-response.interface';


export abstract class BaseCrudController<T, CreateDto = any, UpdateDto = any> {
  constructor(
    protected readonly service: ICrudService<T, CreateDto, UpdateDto>,
    protected readonly entityName: string,
    protected readonly createSchema: Schema,
    protected readonly updateSchema: Schema
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseJoiValidationPipe(instance => instance.createSchema)
  async create(@Body() createDto: CreateDto): Promise<ApiControllerResponse<T>> {
    const data = await this.service.create(createDto);
    return {
      message: `${this.entityName} creado de forma exitosa`,
      data: data
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query?: Record<string, any>): Promise<ApiControllerResponse<T[]>> {
    const filters = {};
    if (query) {
      Object.keys(query).forEach(key => {
        if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
          filters[key] = query[key];
        }
      });
    }
    const data = await this.service.findAll(Object.keys(filters).length ? filters : undefined);
    return {
      message: `Lista de ${this.entityName} obtenida de forma exitosa`,
      data: data
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiControllerResponse<T>> {
    const data = await this.service.findOne(id);
    return {
      message: `${this.entityName} obtenido de forma exitosa`,
      data: data
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseJoiValidationPipe(instance => instance.updateSchema)
  async update(@Param('id', ParseIntPipe) id: number,@Body() updateDto: UpdateDto): Promise<ApiControllerResponse<T>> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException(`ID inválido: ${id}. El ID debe ser un número positivo.`);
    }

    const updated = await this.service.update(id, updateDto);
    return {
      message: `${this.entityName} actualizado de forma exitosa`,
      data: updated
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiControllerResponse<void>> {
    await this.service.remove(id);
    return {
      message: `${this.entityName} eliminado de forma exitosa`,
      data: null,
    };
  }
}