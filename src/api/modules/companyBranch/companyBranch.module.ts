import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyBranchController } from './controllers/companyBranch.controller';
import { CompanyBranchService } from './services/companyBranch.service';
import { CompanyBranchEntity } from './entities/companyBranch.entity';
import { CompanyEntity } from '../company/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyBranchEntity, CompanyEntity]),
  ],
  controllers: [CompanyBranchController],
  providers: [
    {
      provide: CompanyBranchService,
      useClass: CompanyBranchService
    }
  ],
  exports: [CompanyBranchService],
})
export class CompanyBranchModule {}
