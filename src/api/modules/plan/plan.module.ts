import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from './controllers/plan.controller';
import { PlanService } from './services/plan.service';
import { PlanEntity } from './entities/plan.entity';
import { PlanRepository } from './repositories/plan.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanEntity]),
  ],
  controllers: [PlanController],
  providers: [PlanRepository, PlanService],
  exports: [PlanService],
})
export class PlanModule { }