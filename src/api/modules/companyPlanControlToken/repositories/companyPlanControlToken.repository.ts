import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyPlanControlTokenEntity } from '../entities/companyPlanControlToken.entity';

@Injectable()
export class CompanyPlanControlTokenRepository {
  constructor(
    @InjectRepository(CompanyPlanControlTokenEntity)
    private readonly companyPlanControlTokenRepository: Repository<CompanyPlanControlTokenEntity>,
  ) {}

}