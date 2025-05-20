import { Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Query, BadRequestException, UsePipes } from '@nestjs/common';
import { IMongoDbCrudService } from '../interfaces/mongo-crud.interface';
import { Schema } from 'joi';
import { UseJoiValidationPipe } from '../utils/pipes/use-joi.pipe';
import { ApiControllerResponse } from '../interfaces/api-response.interface';
import { Document } from 'mongoose';
import { PaginatedResponse, PaginationOptions } from '../interfaces/mongo-pagination.interface';
import { ApiQuery } from '@nestjs/swagger';

export abstract class BaseMongoDbCrudController<T extends Document, CreateDto = any, UpdateDto = any> {
  constructor(
    protected readonly service: IMongoDbCrudService<T, CreateDto, UpdateDto>,
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
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'paginated', required: false, type: Boolean })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('paginated') paginated?: boolean,
    @Query() query?: Record<string, any>
  ): Promise<ApiControllerResponse<T[] | PaginatedResponse<T>>> {
    // Eliminar parámetros de paginación del objeto query
    const cleanQuery = { ...query };
    delete cleanQuery.page;
    delete cleanQuery.limit;
    delete cleanQuery.paginated;

    // Filtrar propiedades vacías
    const filters = {};
    if (cleanQuery) {
      Object.keys(cleanQuery).forEach(key => {
        if (cleanQuery[key] !== undefined && cleanQuery[key] !== null && cleanQuery[key] !== '') {
          filters[key] = cleanQuery[key];
        }
      });
    }

    // Si se solicita paginación
    if (paginated === true || (page !== undefined || limit !== undefined)) {
      const options: PaginationOptions = {
        page: page ? parseInt(String(page), 10) : 1,
        limit: limit ? parseInt(String(limit), 10) : 10
      };

      const paginatedData = await (this.service as any).findAllPaginated(options, filters);
      return {
        message: `Lista paginada de ${this.entityName} obtenida de forma exitosa`,
        data: paginatedData
      };
    }

    // Lista completa sin paginación
    const data = await this.service.findAll(Object.keys(filters).length ? filters : undefined);
    return {
      message: `Lista de ${this.entityName} obtenida de forma exitosa`,
      data: data
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ApiControllerResponse<T>> {
    const data = await this.service.findOne(id);
    return {
      message: `${this.entityName} obtenido de forma exitosa`,
      data: data
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseJoiValidationPipe(instance => instance.updateSchema)
  async update(@Param('id') id: string, @Body() updateDto: UpdateDto): Promise<ApiControllerResponse<T>> {
    const updated = await this.service.update(id, updateDto);
    return {
      message: `${this.entityName} actualizado de forma exitosa`,
      data: updated
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<ApiControllerResponse<void>> {
    await this.service.remove(id);
    return {
      message: `${this.entityName} eliminado de forma exitosa`,
      data: null,
    };
  }
}