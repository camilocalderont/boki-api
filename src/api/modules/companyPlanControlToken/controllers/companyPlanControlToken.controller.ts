import { Controller, Inject } from '@nestjs/common';
import { CompanyPlanControlTokenService } from '../services/companyPlanControlToken.service';
import { CompanyPlanControlTokenEntity } from '../entities/companyPlanControlToken.entity';
import { CreateCompanyPlanControlTokenDto } from '../dto/companyPlanControlTokenCreate.dto';
import { UpdateCompanyPlanControlTokenDto } from '../dto/companyPlanControlTokenUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createCompanyPlanControlTokenSchema } from '../schemas/companyPlanControlTokenCreate.schema';
import { updateCompanyPlanControlTokenSchema } from '../schemas/companyPlanControlTokenUpdate.schema';

@Controller('company-plan-control-tokens')
export class CompanyPlanControlTokenController extends BaseCrudController<CompanyPlanControlTokenEntity, CreateCompanyPlanControlTokenDto, UpdateCompanyPlanControlTokenDto> {
  constructor(
    @Inject(CompanyPlanControlTokenService)
    private readonly companyPlanControlTokenService: CompanyPlanControlTokenService
  ) {
    super(companyPlanControlTokenService, 'CompanyPlanControlToken', createCompanyPlanControlTokenSchema, updateCompanyPlanControlTokenSchema);
  }
}