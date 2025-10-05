import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplatesController } from './controllers/email-templates.controller';
import { EmailTemplatesService } from './services/email-templates.service';
import { EmailTemplatesEntity } from './entities/email-templates.entity';
import { EmailTemplatesRepository } from './repositories/email-templates.repository';
import { CompanyEntity } from '../company/entities/company.entity';
import { SemanticSearchModule } from '../semanticSearch/semanticSearch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailTemplatesEntity, CompanyEntity]),
    SemanticSearchModule
  ],
  controllers: [EmailTemplatesController],
  providers: [EmailTemplatesRepository, EmailTemplatesService],
  exports: [EmailTemplatesService],
})
export class EmailTemplatesModule {}