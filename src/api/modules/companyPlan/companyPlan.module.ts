import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyPlanController } from './controllers/companyPlan.controller';
import { CompanyPlanService } from './services/companyPlan.service';
import { CompanyPlanEntity } from './entities/companyPlan.entity';
import { CompanyPlanRepository } from './repositories/companyPlan.repository';
import { CompanyEntity } from '../company/entities/company.entity';
import { PlanEntity } from '../plan/entities/plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyPlanEntity, CompanyEntity, PlanEntity]),
  ],
  controllers: [CompanyPlanController],
  providers: [CompanyPlanRepository, CompanyPlanService],
  exports: [CompanyPlanService],
})
export class CompanyPlanModule { }