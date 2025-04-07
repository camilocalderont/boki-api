import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/companyCreate.dto';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
    const company = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(company);
  }

  async findAll(): Promise<CompanyEntity[]> {
    return await this.companyRepository.find();
  }

  async findOne(id: number): Promise<CompanyEntity> {
    return await this.companyRepository.findOne({ where: { Id: id } });
  }

  async findByEmail(email: string): Promise<CompanyEntity> {
    return await this.companyRepository.findOne({ where: { VcPrincipalEmail: email } });
  }

  async update(id: number, updateCompanyDto: Partial<CreateCompanyDto>): Promise<CompanyEntity> {
    await this.companyRepository.update(id, updateCompanyDto);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.companyRepository.delete(id);
  }
}
