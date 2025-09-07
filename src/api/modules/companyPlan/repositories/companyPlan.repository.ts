import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyPlanEntity } from '../entities/companyPlan.entity';

@Injectable()
export class CompanyPlanRepository {
  constructor(
    @InjectRepository(CompanyPlanEntity)
    private readonly companyPlanRepository: Repository<CompanyPlanEntity>,
  ) {}

}