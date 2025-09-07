import { Controller, Inject } from '@nestjs/common';
import { CompanyPlanService } from '../services/companyPlan.service';
import { CompanyPlanEntity } from '../entities/companyPlan.entity';
import { CreateCompanyPlanDto } from '../dto/companyPlanCreate.dto';
import { UpdateCompanyPlanDto } from '../dto/companyPlanUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createCompanyPlanSchema } from '../schemas/companyPlanCreate.schema';
import { updateCompanyPlanSchema } from '../schemas/companyPlanUpdate.schema';

@Controller('company-plans')
export class CompanyPlanController extends BaseCrudController<CompanyPlanEntity, CreateCompanyPlanDto, UpdateCompanyPlanDto> {
  constructor(
    @Inject(CompanyPlanService)
    private readonly companyPlanService: CompanyPlanService
  ) {
    super(companyPlanService, 'CompanyPlan', createCompanyPlanSchema, updateCompanyPlanSchema);
  }
}