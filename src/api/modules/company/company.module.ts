import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { CompanyEntity } from './entities/company.entity';
import { CompanyBlockedTimeEntity } from './entities/companyBlockedTime.entity';
import { CompanyBlockedTimeController } from './controllers/companyBlockedTime.controller';
import { CompanyBlockedTimeService } from './services/companyBlockedTime.service';
import { CompanyBlockedTimeRepository } from './repositories/companyBlockedTime.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, CompanyBlockedTimeEntity]),
  ],
  controllers: [CompanyController, CompanyBlockedTimeController],
  providers: [
    {
      provide: CompanyService,
      useClass: CompanyService
    },
    {
      provide: CompanyBlockedTimeService,
      useClass: CompanyBlockedTimeService
    },
    CompanyBlockedTimeRepository
  ],
  exports: [CompanyService, CompanyBlockedTimeService],
})
export class CompanyModule {}
