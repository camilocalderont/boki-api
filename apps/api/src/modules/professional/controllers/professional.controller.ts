import { Controller, Inject, ValidationPipe, UsePipes, Get, Param, ParseIntPipe, Post, HttpCode, HttpStatus, UseInterceptors, Body, UploadedFile, Put, BadRequestException, ConflictException, Query } from '@nestjs/common';
import { ProfessionalService } from '../services/professional.service';
import { ProfessionalEntity } from '../entities/professional.entity';
import { CreateProfessionalDto } from '../dto/professionalCreate.dto';
import { UpdateProfessionalDto } from '../dto/professionalUpdate.dto';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createProfessionalSchema } from '../schemas/professionalCreate.schema';
import { updateProfessionalSchema } from '../schemas/professionalUpdate.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseJoiValidationPipe } from '~/api/shared/utils/pipes/use-joi.pipe';
import Joi from 'joi';

@Controller('professional')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class ProfessionalController extends BaseCrudController<ProfessionalEntity, CreateProfessionalDto, UpdateProfessionalDto> {
  public createProfessionalSchema = createProfessionalSchema;
  public updateProfessionalSchema = updateProfessionalSchema;

  constructor(
    @Inject(ProfessionalService)
    private readonly professionalService: ProfessionalService
  ) {
    super(professionalService, 'professional', createProfessionalSchema, updateProfessionalSchema);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('photo'))
  async create(@Body() createProfessionalDto: any, @UploadedFile() file?: Express.Multer.File): Promise<ApiControllerResponse<ProfessionalEntity>> {
    if (createProfessionalDto.BussinessHours && typeof createProfessionalDto.BussinessHours === 'string') {
      try {
        createProfessionalDto.BussinessHours = JSON.parse(createProfessionalDto.BussinessHours);
        console.log('BussinessHours procesado:', createProfessionalDto.BussinessHours);
      } catch (error) {
        throw new BadRequestException(
          [{
            code: 'FORMATO_INCORRECTO',
            message: 'El formato de BussinessHours es inválido. Debe ser un JSON válido.',
            field: 'BussinessHours'
          }],
          'Formato de BussinessHours inválido'
        );
      }
    }
    
    if (createProfessionalDto.Services && typeof createProfessionalDto.Services === 'string') {
      try {
        createProfessionalDto.Services = JSON.parse(createProfessionalDto.Services);
        console.log('Services procesado:', createProfessionalDto.Services);
      } catch (error) {
        throw new BadRequestException(
          [{
            code: 'FORMATO_INCORRECTO',
            message: 'El formato de Services es inválido. Debe ser un JSON válido.',
            field: 'Services'
          }],
          'Formato de Services inválido'
        );
      }
    }
    try {
      if (file) {
        const base64Image = file.buffer.toString('base64');
        const format = `data:${file.mimetype};base64,`;
        createProfessionalDto['TxPhoto'] = format + base64Image;
      }

      if (createProfessionalDto['BussinessHours'] && typeof createProfessionalDto['BussinessHours'] === 'string') {
        try {
          createProfessionalDto['BussinessHours'] = JSON.parse(createProfessionalDto['BussinessHours']);
        } catch (error) {
          throw new BadRequestException(
            [{
              code: 'FORMATO_INCORRECTO',
              message: 'El formato de BussinessHours es inválido. Debe ser un JSON válido.',
              field: 'BussinessHours'
            }],
            'Formato de BussinessHours inválido'
          );
        }
      }

      if (createProfessionalDto['Services'] && typeof createProfessionalDto['Services'] === 'string') {
        try {
          createProfessionalDto['Services'] = JSON.parse(createProfessionalDto['Services']);
        } catch (error) {
          throw new BadRequestException(
            [{
              code: 'FORMATO_INCORRECTO',
              message: 'El formato de Services es inválido. Debe ser un JSON válido.',
              field: 'Services'
            }],
            'Formato de Services inválido'
          );
        }
      }

      const data = await this.professionalService.create(createProfessionalDto);
      return {
        message: `${this.entityName} creado de forma exitosa`,
        data: data
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        [{
          code: 'ERROR_CREACION_PROFESIONAL',
          message: `Error al crear profesional: ${error.message || 'Error desconocido'}`,
          field: 'professional'
        }],
        'Error al crear profesional'
      );
    }
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProfessionalDto: any, @UploadedFile() file?: Express.Multer.File): Promise<ApiControllerResponse<ProfessionalEntity>> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException(`ID inválido: ${id}. El ID debe ser un número positivo.`);
    }

    if (file) {
      const base64Image = file.buffer.toString('base64');
      const format = `data:${file.mimetype};base64,`;
      updateProfessionalDto['TxPhoto'] = format + base64Image;
    }
    
    if (updateProfessionalDto.BussinessHours && typeof updateProfessionalDto.BussinessHours === 'string') {
      try {
        updateProfessionalDto.BussinessHours = JSON.parse(updateProfessionalDto.BussinessHours);
      } catch (error) {
        throw new BadRequestException(
          [{
            code: 'FORMATO_INCORRECTO',
            message: 'El formato de BussinessHours es inválido. Debe ser un JSON válido.',
            field: 'BussinessHours'
          }],
          'Formato de BussinessHours inválido'
        );
      }
    }
    
    if (updateProfessionalDto.Services && typeof updateProfessionalDto.Services === 'string') {
      try {
        updateProfessionalDto.Services = JSON.parse(updateProfessionalDto.Services);
      } catch (error) {
        throw new BadRequestException(
          [{
            code: 'FORMATO_INCORRECTO',
            message: 'El formato de Services es inválido. Debe ser un JSON válido.',
            field: 'Services'
          }],
          'Formato de Services inválido'
        );
      }
    }

    const data = await this.professionalService.update(id, updateProfessionalDto);
    return {
      message: `${this.entityName} actualizado de forma exitosa`,
      data: data
    };
  }

  @Get('service/:serviceId')
  async findByServiceId(@Param('serviceId', ParseIntPipe) serviceId: number): Promise<ApiControllerResponse<ProfessionalEntity[]>> {
    if (isNaN(serviceId) || serviceId <= 0) {
      throw new BadRequestException(`ID de servicio inválido: ${serviceId}. El ID debe ser un número positivo.`);
    }
    
    const professionals = await this.professionalService.findByServiceId(serviceId);
    return {
      message: `Profesionales encontrados para el servicio con ID: ${serviceId}`,
      data: professionals
    };
  }

  @Get(':professionalId/general-availability')
  async getGeneralAvailability(@Param('professionalId', ParseIntPipe) professionalId: number, @Query('startDate') startDate?: string): Promise<ApiControllerResponse<any[]>> {
    if (isNaN(professionalId) || professionalId <= 0) {
      throw new BadRequestException(`ID de profesional inválido: ${professionalId}. El ID debe ser un número positivo.`);
    }
    
    let parsedDate;
    
    if (startDate) {
      try {
        if (startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const [year, month, day] = startDate.split('-').map(Number);
          parsedDate = new Date(year, month - 1, day);
        } else {
          parsedDate = new Date(startDate);
        }
        
        if (isNaN(parsedDate.getTime())) {
          throw new BadRequestException(`La fecha proporcionada no es válida: ${startDate}`);
        }
      } catch (error) {
        throw new BadRequestException(`Error al procesar la fecha: ${startDate}`);
      }
    }
    
    const availability = await this.professionalService.findGeneralAvailability(professionalId, parsedDate);
    return {
      message: `Disponibilidad general del profesional con ID: ${professionalId}`,
      data: availability
    };
  }

  @Get(':professionalId/available-slots')
  async getAvailableSlots(@Param('professionalId', ParseIntPipe) professionalId: number, @Query('serviceId', ParseIntPipe) serviceId: number, @Query('date') dateString: string): Promise<ApiControllerResponse<any[]>> {
    if (isNaN(professionalId) || professionalId <= 0) {
      throw new BadRequestException(`ID de profesional inválido: ${professionalId}. El ID debe ser un número positivo.`);
    }

    if (isNaN(serviceId) || serviceId <= 0) {
      throw new BadRequestException(`ID de servicio inválido: ${serviceId}. El ID debe ser un número positivo.`);
    }
    
    if (!dateString || dateString.trim() === '') {
      throw new BadRequestException('La fecha es obligatoria. Debe proporcionar una fecha válida (YYYY-MM-DD).');
    }
    
    let date: Date;
    try {
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida');
      }
    } catch (error) {
      throw new BadRequestException(`Formato de fecha inválido: ${dateString}. Debe ser una fecha válida (YYYY-MM-DD).`);
    }
    
    const availableSlots = await this.professionalService.findAvailableSlots(professionalId, serviceId, date);
    return {
      message: `Espacios disponibles para el profesional con ID: ${professionalId}, servicio con ID: ${serviceId} y fecha: ${dateString}`,
      data: availableSlots
    };
  }
}
