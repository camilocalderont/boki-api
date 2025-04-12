import { Controller, Inject, ValidationPipe, UsePipes, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CompanyBranchService } from '../services/companyBranch.service';
import { CompanyBranchEntity } from '../entities/companyBranch.entity';
import { CreateCompanyBranchDto } from '../dto/companyBranchCreate.dto';
import { UpdateCompanyBranchDto } from '../dto/companyBranchUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import Joi from 'joi';
@Controller('company-branches')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class CompanyBranchController extends BaseCrudController<CompanyBranchEntity, CreateCompanyBranchDto, UpdateCompanyBranchDto> {
  constructor(
    @Inject(CompanyBranchService)
    private readonly companyBranchService: CompanyBranchService
  ) {
    const createSchema = Joi.object({});
    const updateSchema = Joi.object({});
    super(companyBranchService, 'company-branches', createSchema, updateSchema);
  }

  @Get('company/:companyId')
  async findByCompany(@Param('companyId', ParseIntPipe) companyId: number): Promise<CompanyBranchEntity[]> {
    return await this.companyBranchService.findByCompany(companyId);
  }

  @Get('company/:companyId/principal')
  async findPrincipalByCompany(@Param('companyId', ParseIntPipe) companyId: number): Promise<CompanyBranchEntity> {
    return await this.companyBranchService.findPrincipalByCompany(companyId);
  }
}
