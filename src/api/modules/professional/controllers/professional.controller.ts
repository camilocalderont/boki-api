import { Controller, Inject, ValidationPipe, UsePipes, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProfessionalService } from '../services/professional.service';
import { ProfessionalEntity } from '../entities/professional.entity';
import { CreateProfessionalDto } from '../dto/professionalCreate.dto';
import { UpdateProfessionalDto } from '../dto/professionalUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import Joi from 'joi';
@Controller('professionals')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class ProfessionalController extends BaseCrudController<ProfessionalEntity, CreateProfessionalDto, UpdateProfessionalDto> {
  constructor(
    @Inject(ProfessionalService)
    private readonly professionalService: ProfessionalService
  ) {
    const createSchema = Joi.object({});
    const updateSchema = Joi.object({});
    super(professionalService, 'professionals', createSchema, updateSchema);
  }

  @Get('specialization/:specialization')
  async findBySpecialization(@Param('specialization') specialization: string): Promise<ProfessionalEntity[]> {
    return await this.professionalService.findBySpecialization(specialization);
  }

  @Get('experience/:years')
  async findByExperienceYears(@Param('years', ParseIntPipe) years: number): Promise<ProfessionalEntity[]> {
    return await this.professionalService.findByExperienceYears(years);
  }
}
