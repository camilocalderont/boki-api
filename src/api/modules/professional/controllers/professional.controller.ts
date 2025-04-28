import { Controller, Inject, ValidationPipe, UsePipes, Get, Param, ParseIntPipe, Post, HttpCode, HttpStatus, UseInterceptors, Body, UploadedFile, Put, BadRequestException } from '@nestjs/common';
import { ProfessionalService } from '../services/professional.service';
import { ProfessionalEntity } from '../entities/professional.entity';
import { CreateProfessionalDto } from '../dto/professionalCreate.dto';
import { UpdateProfessionalDto } from '../dto/professionalUpdate.dto';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { professionalCreateSchema } from '../schemas/professionalCreate.schema';
import { professionalUpdateSchema } from '../schemas/professionalUpdate.schema';
import Joi from 'joi';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseJoiValidationPipe } from '~/api/shared/utils/pipes/use-joi.pipe';

@Controller('professional')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class ProfessionalController extends BaseCrudController<ProfessionalEntity, CreateProfessionalDto, UpdateProfessionalDto> {
  public professionalCreateSchema = professionalCreateSchema;
  public professionalUpdateSchema = professionalUpdateSchema;

  constructor(
    @Inject(ProfessionalService)
    private readonly professionalService: ProfessionalService
  ) {
    super(professionalService, 'professional', professionalCreateSchema, professionalUpdateSchema);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('photo'))
  @UseJoiValidationPipe(instance => instance.professionalCreateSchema)
  async create(@Body() createProfessionalDto: CreateProfessionalDto, @UploadedFile() file?: Express.Multer.File): Promise<ApiControllerResponse<ProfessionalEntity>> {
    if (file) {
      const base64Image = file.buffer.toString('base64');
      const format = `data:${file.mimetype};base64,`;
      createProfessionalDto['TxPhoto'] = format + base64Image;
    }

    const data = await this.professionalService.create(createProfessionalDto);
    return {
      message: `${this.entityName} creado de forma exitosa`,
      data: data
    };
  }

  @Get('specialization/:specialization')
  async findBySpecialization(@Param('specialization') specialization: string): Promise<ProfessionalEntity[]> {
    return await this.professionalService.findBySpecialization(specialization);
  }

  @Get('experience/:years')
  async findByExperienceYears(@Param('years', ParseIntPipe) years: number): Promise<ProfessionalEntity[]> {
    return await this.professionalService.findByExperienceYears(years);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('photo'))
  @UseJoiValidationPipe(instance => instance.professionalUpdateSchema)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProfessionalDto: UpdateProfessionalDto, @UploadedFile() file?: Express.Multer.File): Promise<ApiControllerResponse<ProfessionalEntity>> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException(`ID inválido: ${id}. El ID debe ser un número positivo.`);
    }

    if (file) {
      const base64Image = file.buffer.toString('base64');
      const format = `data:${file.mimetype};base64,`;
      updateProfessionalDto['TxPhoto'] = format + base64Image;
    }

    const data = await this.professionalService.update(id, updateProfessionalDto);
    return {
      message: `${this.entityName} actualizado de forma exitosa`,
      data: data
    };
  }
}
