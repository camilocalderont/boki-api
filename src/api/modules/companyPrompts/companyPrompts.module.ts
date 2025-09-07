import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyPromptsController } from './controllers/companyPrompts.controller';
import { CompanyPromptsService } from './services/companyPrompts.service';
import { CompanyPromptsEntity } from './entities/companyPrompts.entity';
import { CompanyPromptsRepository } from './repositories/companyPrompts.repository';
import { CompanyEntity } from '../company/entities/company.entity';
import { UsersEntity } from '../users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyPromptsEntity, CompanyEntity, UsersEntity]),
  ],
  controllers: [CompanyPromptsController],
  providers: [CompanyPromptsRepository, CompanyPromptsService],
  exports: [CompanyPromptsService],
})
export class CompanyPromptsModule { }