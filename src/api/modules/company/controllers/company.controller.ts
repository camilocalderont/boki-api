import {Controller, Inject, ValidationPipe, UsePipes} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CompanyEntity } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/companyCreate.dto';
import { UpdateCompanyDto } from '../dto/companyUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import Joi from 'joi';

@Controller('companies')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class CompanyController extends BaseCrudController<CompanyEntity, CreateCompanyDto, UpdateCompanyDto> {
  constructor(
    @Inject(CompanyService)
    private readonly companyService: CompanyService
  ) {
    const createSchema = Joi.object({});
    const updateSchema = Joi.object({});
    super(companyService, 'companies', createSchema, updateSchema);
  }
}
