import { Controller, Inject, ValidationPipe, UsePipes, HttpStatus, HttpCode, Get, ParseIntPipe, Param } from '@nestjs/common';
import { CompanyPromptsService } from '../services/companyPrompts.service';
import { CompanyPromptsEntity } from '../entities/companyPrompts.entity';
import { CreateCompanyPromptsDto } from '../dto/companyPromptsCreate.dto';
import { UpdateCompanyPromptsDto } from '../dto/companyPromptsUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createCompanyPromptsSchema } from '../schemas/companyPromptsCreate.schema';
import { updateCompanyPromptsSchema } from '../schemas/companyPromptsUpdate.schema';
import { ApiControllerResponse } from '~/api/shared/interfaces/api-response.interface';

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

  @Get('company/:companyId')
  @HttpCode(HttpStatus.OK)
  async findByCompanyId(@Param('companyId', ParseIntPipe) companyId: number): Promise<ApiControllerResponse<CompanyPromptsEntity[]>> {
    const data = await this.companyPromptsService.findByCompanyId(companyId);
    return {
      message: `CompanyPrompts para la empresa ${companyId} obtenidos de forma exitosa`,
      data: data
    };
  }
}