import { Controller, Inject, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { SemanticSearchDto } from '../dto/semanticSearch.dto';
import { Public } from '../../../shared/decorators/public.decorator';
import { SemanticSearchService } from '../services/semanticSearch.service';

@Controller('semantic-search')
@UsePipes(new ValidationPipe({
  transform: true,
  forbidNonWhitelisted: false, 
  transformOptions: { enableImplicitConversion: true },
}))
export class SemanticSearchController {
  constructor(
    @Inject(SemanticSearchService)
    private readonly semanticSearchService: SemanticSearchService,
  ) {}

  @Public()
  @Post()
  async search(@Body() dto: SemanticSearchDto) {
    return await this.semanticSearchService.searchSimilarFaqs(
      dto.userMessage,
      dto.idIntencion,
    );
  }

  @Public()
  @Post('generate-embeddings')
  async generateEmbeddings() {
    return await this.semanticSearchService.generateAllFaqEmbeddings();
  }
}