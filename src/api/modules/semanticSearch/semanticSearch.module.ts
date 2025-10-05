import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemanticSearchController } from './controllers/semanticSearch.controller';
import { SemanticSearchService } from './services/semanticSearch.service';
import { EmbeddingService } from './embedding/embedding.service';
import { SemanticSearchRepository } from './repositories/semantic-search.repository';
import { FaqsEntity } from '../faqs/entities/faqs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FaqsEntity])
  ],
  controllers: [SemanticSearchController],
  providers: [
    SemanticSearchService,
    EmbeddingService,             
    SemanticSearchRepository,     
  ],
  exports: [
    SemanticSearchService,
    EmbeddingService,            
  ],
})
export class SemanticSearchModule {}