import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyPlanControlTokenController } from './controllers/companyPlanControlToken.controller';
import { CompanyPlanControlTokenService } from './services/companyPlanControlToken.service';
import { CompanyPlanControlTokenEntity } from './entities/companyPlanControlToken.entity';
import { CompanyPlanControlTokenRepository } from './repositories/companyPlanControlToken.repository';
import { CompanyPlanEntity } from '../companyPlan/entities/companyPlan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyPlanControlTokenEntity, CompanyPlanEntity]),
  ],
  controllers: [CompanyPlanControlTokenController],
  providers: [CompanyPlanControlTokenRepository, CompanyPlanControlTokenService],
  exports: [CompanyPlanControlTokenService],
})
export class CompanyPlanControlTokenModule { }