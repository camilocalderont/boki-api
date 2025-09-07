import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyPlanControlTokenEntity } from '../entities/companyPlanControlToken.entity';
import { CreateCompanyPlanControlTokenDto } from '../dto/companyPlanControlTokenCreate.dto';
import { UpdateCompanyPlanControlTokenDto } from '../dto/companyPlanControlTokenUpdate.dto';
import { ICrudService } from '../../../shared/interfaces/crud.interface';

@Injectable()
export class CompanyPlanControlTokenService implements ICrudService<CompanyPlanControlTokenEntity, CreateCompanyPlanControlTokenDto, UpdateCompanyPlanControlTokenDto> {
  constructor(
    @InjectRepository(CompanyPlanControlTokenEntity)
    private readonly companyPlanControlTokenRepository: Repository<CompanyPlanControlTokenEntity>,
  ) {}

  async create(createCompanyPlanControlTokenDto: CreateCompanyPlanControlTokenDto): Promise<CompanyPlanControlTokenEntity> {
    const companyPlanControlToken = this.companyPlanControlTokenRepository.create(createCompanyPlanControlTokenDto);
    return await this.companyPlanControlTokenRepository.save(companyPlanControlToken);
  }

  async findAll(filters?: any): Promise<CompanyPlanControlTokenEntity[]> {
    return await this.companyPlanControlTokenRepository.find({
      where: filters,
      relations: ['CompanyPlan']
    });
  }

  async findOne(id: number): Promise<CompanyPlanControlTokenEntity> {
    const companyPlanControlToken = await this.companyPlanControlTokenRepository.findOne({
      where: { Id: id },
      relations: ['CompanyPlan']
    });
    
    if (!companyPlanControlToken) {
      throw new NotFoundException(`CompanyPlanControlToken con ID ${id} no encontrado`);
    }
    
    return companyPlanControlToken;
  }

  async update(id: number, updateCompanyPlanControlTokenDto: UpdateCompanyPlanControlTokenDto): Promise<CompanyPlanControlTokenEntity> {
    await this.findOne(id);
    await this.companyPlanControlTokenRepository.update(id, updateCompanyPlanControlTokenDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const companyPlanControlToken = await this.findOne(id);
    await this.companyPlanControlTokenRepository.remove(companyPlanControlToken);
  }
}