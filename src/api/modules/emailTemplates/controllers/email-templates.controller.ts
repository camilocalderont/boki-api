import { Controller, Inject, ValidationPipe, UsePipes, Get, Post, Body, Param, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
import { EmailTemplatesService } from '../services/email-templates.service';
import { EmailTemplatesEntity } from '../entities/email-templates.entity';
import { CreateEmailTemplatesDto } from '../dto/email-templates-create.dto';
import { UpdateEmailTemplatesDto } from '../dto/email-templates-update.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createEmailTemplatesSchema } from '../schemas/email-templates-create.schema';
import { updateEmailTemplatesSchema } from '../schemas/email-templates-update.schema';
import { ApiControllerResponse } from '../../../shared/interfaces/api-response.interface';
import { Public } from '../../../shared/decorators/public.decorator';

@Controller('email-templates')
@UsePipes(new ValidationPipe({
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class EmailTemplatesController extends BaseCrudController<
  EmailTemplatesEntity, 
  CreateEmailTemplatesDto, 
  UpdateEmailTemplatesDto
> {
  constructor(
    @Inject(EmailTemplatesService)
    private readonly emailTemplatesService: EmailTemplatesService
  ) {
    super(emailTemplatesService, 'email-templates', createEmailTemplatesSchema, updateEmailTemplatesSchema);
  }

  @Post()
  async create(@Body() createDto: CreateEmailTemplatesDto): Promise<ApiControllerResponse<EmailTemplatesEntity>> {
    const template = await this.emailTemplatesService.create(createDto);
    return {
      message: 'Template de email creado exitosamente con embedding generado',
      data: template
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmailTemplatesDto
  ): Promise<ApiControllerResponse<EmailTemplatesEntity>> {
    const template = await this.emailTemplatesService.update(id, updateDto);
    return {
      message: 'Template de email actualizado exitosamente',
      data: template
    };
  }

  @Get('company/:companyId')
  async getByCompany(@Param('companyId', ParseIntPipe) companyId: number): Promise<ApiControllerResponse<EmailTemplatesEntity[]>> {
    const templates = await this.emailTemplatesService.findByCompanyId(companyId);
    return {
      message: 'Templates de email obtenidos exitosamente',
      data: templates
    };
  }

  @Post('regenerate-embeddings')
  async regenerateEmbeddings(
    @Query('companyId', ParseIntPipe) companyId?: number
  ): Promise<ApiControllerResponse<{ processed: number; message: string }>> {
    const result = await this.emailTemplatesService.regenerateEmbeddings(companyId);
    return {
      message: 'Embeddings regenerados exitosamente',
      data: result
    };
  }
}