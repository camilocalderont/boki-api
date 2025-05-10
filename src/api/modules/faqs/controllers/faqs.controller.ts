import { Controller, Inject, ValidationPipe, UsePipes } from '@nestjs/common';
import { FaqsService } from '../services/faqs.service';
import { FaqsEntity } from '../entities/faqs.entity';
import { CreateFaqsDto } from '../dto/faqsCreate.dto';
import { UpdateFaqsDto } from '../dto/faqsUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createFaqsSchema } from '../schemas/faqsCreate.schema';
import { updateFaqsSchema } from '../schemas/faqsUpdate.schema';

@Controller('faqs')
@UsePipes(new ValidationPipe({
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class FaqsController extends BaseCrudController<FaqsEntity, CreateFaqsDto, UpdateFaqsDto> {
  constructor(
    @Inject(FaqsService)
    private readonly faqsService: FaqsService
  ) {
    super(faqsService, 'faqs', createFaqsSchema, updateFaqsSchema);
  }
}