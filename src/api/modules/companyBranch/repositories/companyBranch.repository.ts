import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyBranchEntity } from '../entities/companyBranch.entity';
import { CreateCompanyBranchDto } from '../dto/companyBranchCreate.dto';

@Injectable()
export class CompanyBranchRepository {
  constructor(
    @InjectRepository(CompanyBranchEntity)
    private readonly companyBranchRepository: Repository<CompanyBranchEntity>,
  ) {}
  
  async findByCompany(companyId: number): Promise<CompanyBranchEntity[]> {
    return await this.companyBranchRepository.find({ 
      where: { CompanyId: companyId },
      relations: ['Company']
    });
  }

  async findPrincipalByCompany(companyId: number): Promise<CompanyBranchEntity> {
    return await this.companyBranchRepository.findOne({ 
      where: { 
        CompanyId: companyId,
        BIsPrincipal: true
      },
      relations: ['Company']
    });
  }

}
