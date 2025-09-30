import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemanticSearchController } from './controllers/semanticSearch.controller';
import { SemanticSearchService } from './services/semanticSearch.service';
import { FaqsEntity } from '../faqs/entities/faqs.entity';


@Module({
    imports: [TypeOrmModule.forFeature([FaqsEntity])
    ],
    controllers: [SemanticSearchController],
    providers: [SemanticSearchService],
    exports: [SemanticSearchService],
})
export class SemanticSearchModule { }