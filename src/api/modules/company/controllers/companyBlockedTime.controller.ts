import { Controller, Inject, ValidationPipe, UsePipes } from '@nestjs/common';
import { BaseCrudController } from "../../../shared/controllers/crud.controller";
import { CompanyBlockedTimeEntity } from "../entities/companyBlockedTime.entity";
import { CreateCompanyBlockedTimeDto } from "../dto/companyBlockedTimeCreate.dto";
import { UpdateCompanyBlockedTimeDto } from "../dto/companyBlockedTimeUpdate.dto";
import { createCompanyBlockedTimeSchema } from '../schemas/companyBlockedTimeCreate.schema';
import { updateCompanyBlockedTimeSchema } from '../schemas/companyBlockedTimeUpdate.schema';
import { CompanyBlockedTimeService } from '../services/companyBlockedTime.service';

@Controller('company-blocked-times')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class CompanyBlockedTimeController extends BaseCrudController<CompanyBlockedTimeEntity, CreateCompanyBlockedTimeDto, UpdateCompanyBlockedTimeDto> {
  constructor(
    @Inject(CompanyBlockedTimeService)
    private readonly companyBlockedTimeService: CompanyBlockedTimeService
  ) {
    super(companyBlockedTimeService, 'company-blocked-times', createCompanyBlockedTimeSchema, updateCompanyBlockedTimeSchema);
  }
}