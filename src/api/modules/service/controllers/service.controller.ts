import { Controller, Get, Param, ParseIntPipe, UsePipes, ValidationPipe, Inject, Post, Body, UseInterceptors, UploadedFile, HttpCode, HttpStatus, Put, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';
import { ServiceService } from '../services/service.service';
import { ServiceEntity } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/serviceCreate.dto';
import { UpdateServiceDto } from '../dto/serviceUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createServiceSchema } from '../schemas/serviceCreate.schema';
import { updateServiceSchema } from '../schemas/serviceUpdate.schema';
import { UseJoiValidationPipe } from '../../../shared/utils/pipes/use-joi.pipe';
import Joi from 'joi';

@Controller('services')
@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true }
}))
export class ServiceController extends BaseCrudController<ServiceEntity, CreateServiceDto, UpdateServiceDto> {
    public createServiceSchema = createServiceSchema;
    public updateServiceSchema = updateServiceSchema;

    constructor(
        @Inject(ServiceService)
        private readonly serviceService: ServiceService
    ) {
        super(serviceService, 'Service', createServiceSchema, updateServiceSchema);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('picture'))
    @UseJoiValidationPipe(instance => instance.createServiceSchema)
    async create(@Body() createServiceDto: CreateServiceDto, @UploadedFile() file?: Express.Multer.File): Promise<ApiControllerResponse<ServiceEntity>> {
        if (file) {
            const base64Image = file.buffer.toString('base64');
            const format = `data:${file.mimetype};base64,`;
            createServiceDto['TxPicture'] = format + base64Image;
        }

        const data = await this.serviceService.create(createServiceDto);
        return {
            message: `${this.entityName} creado de forma exitosa`,
            data: data
        };
    }

    @Get('company/:id')
    async findByCompany(@Param('id', ParseIntPipe) id: number): Promise<ServiceEntity[]> {
        return this.serviceService.findByCompany(id);
    }

    @Get('category/:id')
    async findByCategory(@Param('id', ParseIntPipe) id: number): Promise<ServiceEntity[]> {
        return this.serviceService.findByCategory(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('picture'))
    @UseJoiValidationPipe(instance => instance.updateServiceSchema)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateServiceDto: UpdateServiceDto,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<ApiControllerResponse<ServiceEntity>> {
        if (isNaN(id) || id <= 0) {
            throw new BadRequestException(`ID inválido: ${id}. El ID debe ser un número positivo.`);
        }

        if (file) {
            const base64Image = file.buffer.toString('base64');
            const format = `data:${file.mimetype};base64,`;
            updateServiceDto['TxPicture'] = format + base64Image;
        }

        const data = await this.serviceService.update(id, updateServiceDto);
        return {
            message: `${this.entityName} actualizado de forma exitosa`,
            data: data
        };
    }
}
