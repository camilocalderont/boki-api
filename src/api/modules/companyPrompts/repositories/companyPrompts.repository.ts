import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyPromptsEntity } from '../entities/companyPrompts.entity';

@Injectable()
export class CompanyPromptsRepository {
  constructor(
    @InjectRepository(CompanyPromptsEntity)
    private readonly companyPromptsRepository: Repository<CompanyPromptsEntity>,
  ) {}

}