import { Controller, Inject, ValidationPipe, UsePipes, Get, Param, HttpCode, HttpStatus, Post, Body, Put, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { CategoryServiceService } from '../services/categoryService.service';
import { CategoryServiceEntity } from '../entities/categoryService.entity';
import { CreateCategoryServiceDto } from '../dto/categoryServiceCreate.dto';
import { UpdateCategoryServiceDto } from '../dto/categoryServiceUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { ApiControllerResponse } from '~/api/shared/interfaces/api-response.interface';
import Joi from 'joi';
@Controller('category-services')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class CategoryServiceController extends BaseCrudController<CategoryServiceEntity, CreateCategoryServiceDto, UpdateCategoryServiceDto> {
    constructor(
        @Inject(CategoryServiceService)
        private readonly categoryServiceService: CategoryServiceService
    ) {
        const createSchema = Joi.object({
            VcName: Joi.string().min(1).max(255),
            CompanyId: Joi.number().integer().positive(),
            BIsService: Joi.boolean()
        }).min(1);
        const updateSchema = Joi.object({
            VcName: Joi.string().min(1).max(255),
            CompanyId: Joi.number().integer().positive(),
            BIsService: Joi.boolean()
        }).min(1);
        super(categoryServiceService, 'category-services', createSchema, updateSchema);
    }

    @Get('company/:companyId')
    @HttpCode(HttpStatus.OK)
    async categoriesByCompanyId(@Param('companyId') companyId: number): Promise<ApiControllerResponse<CategoryServiceEntity[]>> {
        const data = await this.categoryServiceService.categoriesByCompanyId(companyId);
        return {
            message: 'Categorías obtenidas de forma exitosa',
            data: data
        };
    }

    @Get('llm/company/:companyId')
    @HttpCode(HttpStatus.OK)
    async categoriesByCompanyIdForLLM(@Param('companyId') companyId: number): Promise<{ Id: number; VcName: string }[]> {
        return await this.categoryServiceService.categoriesByCompanyIdForLLM(companyId);
    }
}
