import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplatesEntity } from '../entities/email-templates.entity';

@Injectable()
export class EmailTemplatesRepository {
  constructor(
    @InjectRepository(EmailTemplatesEntity)
    private readonly emailTemplatesRepository: Repository<EmailTemplatesEntity>,
  ) {}

  async findByCompanyId(companyId: number): Promise<EmailTemplatesEntity[]> {
    return this.emailTemplatesRepository.find({
      where: { CompanyId: companyId }
    });
  }

  async findWithoutEmbeddings(companyId?: number): Promise<EmailTemplatesEntity[]> {
    const query = this.emailTemplatesRepository
      .createQueryBuilder('template')
      .where('template.Embedding IS NULL');
    
    if (companyId) {
      query.andWhere('template.CompanyId = :companyId', { companyId });
    }
    
    return query.getMany();
  }
}