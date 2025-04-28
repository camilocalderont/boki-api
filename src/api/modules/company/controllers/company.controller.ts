import { Controller, Inject, ValidationPipe, UsePipes, Post, HttpCode, HttpStatus, UseInterceptors, Body, UploadedFile, UploadedFiles, Put, Param, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CompanyEntity } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/companyCreate.dto';
import { UpdateCompanyDto } from '../dto/companyUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createCompanySchema } from '../schemas/companyCreate.schema';
import { updateCompanySchema } from '../schemas/companyUpdate.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';
import { UseJoiValidationPipe } from '../../../shared/utils/pipes/use-joi.pipe';
import Joi from 'joi';

@Controller('companies')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class CompanyController extends BaseCrudController<CompanyEntity, CreateCompanyDto, UpdateCompanyDto> {
  public createCompanySchema = createCompanySchema;
  public updateCompanySchema = updateCompanySchema;

  constructor(
    @Inject(CompanyService)
    private readonly companyService: CompanyService
  ) {
    super(companyService, 'companies', createCompanySchema, updateCompanySchema);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }, { name: 'images', maxCount: 10 }]))
  @UseJoiValidationPipe(instance => instance.createCompanySchema)
  async create(@Body() createCompanyDto: CreateCompanyDto, @UploadedFiles() files?: { logo?: Express.Multer.File[], images?: Express.Multer.File[] }): Promise<ApiControllerResponse<CompanyEntity>> {
    if (files?.logo && files.logo.length > 0) {
      const logoFile = files.logo[0];
      const base64Logo = logoFile.buffer.toString('base64');
      const logoFormat = `data:${logoFile.mimetype};base64,`;
      createCompanyDto['TxLogo'] = logoFormat + base64Logo;
    }

    if (files?.images && files.images.length > 0) {
      const imagesBase64 = files.images.map(imgFile => {
        const base64Image = imgFile.buffer.toString('base64');
        const imgFormat = `data:${imgFile.mimetype};base64,`;
        return imgFormat + base64Image;
      });
      createCompanyDto['TxImages'] = JSON.stringify(imagesBase64);
    }

    const data = await this.companyService.create(createCompanyDto);
    return {
      message: `${this.entityName} creado de forma exitosa`,
      data: data
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }, { name: 'images', maxCount: 10 }]))
  @UseJoiValidationPipe(instance => instance.updateCompanySchema)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCompanyDto: UpdateCompanyDto, @UploadedFiles() files?: { logo?: Express.Multer.File[], images?: Express.Multer.File[] }): Promise<ApiControllerResponse<CompanyEntity>> {
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException(`ID inválido: ${id}. El ID debe ser un número positivo.`);
    }

    if (files?.logo && files.logo.length > 0) {
      const logoFile = files.logo[0];
      const base64Logo = logoFile.buffer.toString('base64');
      const logoFormat = `data:${logoFile.mimetype};base64,`;
      updateCompanyDto['TxLogo'] = logoFormat + base64Logo;
    }

    if (files?.images && files.images.length > 0) {
      const imagesBase64 = files.images.map(imgFile => {
        const base64Image = imgFile.buffer.toString('base64');
        const imgFormat = `data:${imgFile.mimetype};base64,`;
        return imgFormat + base64Image;
      });
      updateCompanyDto['TxImages'] = JSON.stringify(imagesBase64);
    }

    const data = await this.companyService.update(id, updateCompanyDto);
    return {
      message: `${this.entityName} actualizado de forma exitosa`,
      data: data
    };
  }

}