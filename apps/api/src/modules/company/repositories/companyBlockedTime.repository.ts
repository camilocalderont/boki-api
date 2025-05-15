import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyBlockedTimeEntity } from '../entities/companyBlockedTime.entity';

@Injectable()
export class CompanyBlockedTimeRepository {
  constructor(
    @InjectRepository(CompanyBlockedTimeEntity)
    private readonly companyBlockedTimeRepository: Repository<CompanyBlockedTimeEntity>,
  ) {}

}
