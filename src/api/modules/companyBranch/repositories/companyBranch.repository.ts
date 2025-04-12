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

  async create(createCompanyBranchDto: CreateCompanyBranchDto): Promise<CompanyBranchEntity> {
    const companyBranch = this.companyBranchRepository.create(createCompanyBranchDto);
    return await this.companyBranchRepository.save(companyBranch);
  }

  async findAll(): Promise<CompanyBranchEntity[]> {
    return await this.companyBranchRepository.find({ 
      relations: ['Company']
    });
  }

  async findOne(id: number): Promise<CompanyBranchEntity> {
    return await this.companyBranchRepository.findOne({ 
      where: { Id: id },
      relations: ['Company']
    });
  }

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

  async update(id: number, updateCompanyBranchDto: Partial<CreateCompanyBranchDto>): Promise<CompanyBranchEntity> {
    await this.companyBranchRepository.update(id, updateCompanyBranchDto);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.companyBranchRepository.delete(id);
  }
}
