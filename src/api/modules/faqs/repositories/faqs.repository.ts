import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaqsEntity } from '../entities/faqs.entity';

@Injectable()
export class FaqsRepository {
  constructor(
    @InjectRepository(FaqsEntity)
    private readonly faqsRepository: Repository<FaqsEntity>,
  ) {}

  async findAll(filters?: Record<string, any>): Promise<FaqsEntity[]> {
    return await this.faqsRepository.find({
      relations: ['Company', 'CategoryService'],
      where: filters
    });
  }
}
