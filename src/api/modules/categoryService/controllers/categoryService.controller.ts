import { Controller, Inject, ValidationPipe, UsePipes } from '@nestjs/common';
import { CategoryServiceService } from '../services/categoryService.service';
import { CategoryServiceEntity } from '../entities/categoryService.entity';
import { CreateCategoryServiceDto } from '../dto/categoryServiceCreate.dto';
import { UpdateCategoryServiceDto } from '../dto/categoryServiceUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
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
        const createSchema = Joi.object({});
        const updateSchema = Joi.object({});
        super(categoryServiceService, 'category-services', createSchema, updateSchema);
    }
}
