import { Controller, Inject, ValidationPipe, UsePipes } from '@nestjs/common';
import { TagsService } from '../services/tags.service';
import { TagsEntity } from '../entities/tags.entity';
import { CreateTagsDto } from '../dto/tagsCreate.dto';
import { UpdateTagsDto } from '../dto/tagsUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createTagsSchema } from '../schemas/tagsCreate.schema';
import { updateTagsSchema } from '../schemas/tagsUpdate.schema';

@Controller('tags')
@UsePipes(new ValidationPipe({
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class TagsController extends BaseCrudController<TagsEntity, CreateTagsDto, UpdateTagsDto> {
  constructor(
    @Inject(TagsService)
    private readonly tagsService: TagsService
  ) {
    super(tagsService, 'tags', createTagsSchema, updateTagsSchema);
  }
}