import { Controller, Inject, ValidationPipe, UsePipes, Get, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CompanyBranchService } from '../services/companyBranch.service';
import { CompanyBranchEntity } from '../entities/companyBranch.entity';
import { CreateCompanyBranchDto } from '../dto/companyBranchCreate.dto';
import { UpdateCompanyBranchDto } from '../dto/companyBranchUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createCompanyBranchSchema } from '../schemas/companyBranchCreate.schema';
import { updateCompanyBranchSchema } from '../schemas/companyBranchUpdate.schema';
import { ApiControllerResponse } from '~/api/shared/interfaces/api-response.interface';

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
    // Utilizar los esquemas creados para validar la creación y actualización
    super(companyBranchService, 'company-branches', createCompanyBranchSchema, updateCompanyBranchSchema);
  }

  @Get('company/:companyId')
   @HttpCode(HttpStatus.OK)
  async findByCompany(@Param('companyId', ParseIntPipe) companyId: number): Promise<ApiControllerResponse<CompanyBranchEntity>> {
    const data =  await this.companyBranchService.findByCompany(companyId);
    return {
      message: 'Company branches successfully obtained',
      data: data
    };
  }

  @Get('company/:companyId/principal')
   @HttpCode(HttpStatus.OK)
  async findPrincipalByCompany(@Param('companyId', ParseIntPipe) companyId: number): Promise<ApiControllerResponse<CompanyBranchEntity>> {
    const data =  await this.companyBranchService.findPrincipalByCompany(companyId);
    return {
      message: 'Company branch successfully obtained',
      data: data
    };
  }
}
