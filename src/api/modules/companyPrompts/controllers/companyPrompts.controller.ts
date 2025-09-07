import { Controller, Inject, ValidationPipe, UsePipes } from '@nestjs/common';
import { CompanyPromptsService } from '../services/companyPrompts.service';
import { CompanyPromptsEntity } from '../entities/companyPrompts.entity';
import { CreateCompanyPromptsDto } from '../dto/companyPromptsCreate.dto';
import { UpdateCompanyPromptsDto } from '../dto/companyPromptsUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createCompanyPromptsSchema } from '../schemas/companyPromptsCreate.schema';
import { updateCompanyPromptsSchema } from '../schemas/companyPromptsUpdate.schema';

@Controller('company-prompts')
@UsePipes(new ValidationPipe({
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class CompanyPromptsController extends BaseCrudController<CompanyPromptsEntity, CreateCompanyPromptsDto, UpdateCompanyPromptsDto> {
  constructor(
    @Inject(CompanyPromptsService)
    private readonly companyPromptsService: CompanyPromptsService
  ) {
    super(companyPromptsService, 'CompanyPrompts', createCompanyPromptsSchema, updateCompanyPromptsSchema);
  }
}