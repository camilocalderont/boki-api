import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { CompanyEntity } from './entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity]),
  ],
  controllers: [CompanyController],
  providers: [
    {
      provide: CompanyService,
      useClass: CompanyService
    }
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
