import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyPlanEntity } from '../entities/companyPlan.entity';
import { CreateCompanyPlanDto } from '../dto/companyPlanCreate.dto';
import { UpdateCompanyPlanDto } from '../dto/companyPlanUpdate.dto';
import { ICrudService } from '../../../shared/interfaces/crud.interface';

@Injectable()
export class CompanyPlanService implements ICrudService<CompanyPlanEntity, CreateCompanyPlanDto, UpdateCompanyPlanDto> {
  constructor(
    @InjectRepository(CompanyPlanEntity)
    private readonly companyPlanRepository: Repository<CompanyPlanEntity>,
  ) {}

  async create(createCompanyPlanDto: CreateCompanyPlanDto): Promise<CompanyPlanEntity> {
    const companyPlan = this.companyPlanRepository.create(createCompanyPlanDto);
    return await this.companyPlanRepository.save(companyPlan);
  }

  async findAll(filters?: any): Promise<CompanyPlanEntity[]> {
    return await this.companyPlanRepository.find({
      where: filters,
      relations: ['Company', 'Plan', 'CompanyPlanControlTokens']
    });
  }

  async findOne(id: number): Promise<CompanyPlanEntity> {
    const companyPlan = await this.companyPlanRepository.findOne({
      where: { Id: id },
      relations: ['Company', 'Plan', 'CompanyPlanControlTokens']
    });
    
    if (!companyPlan) {
      throw new NotFoundException(`CompanyPlan con ID ${id} no encontrado`);
    }
    
    return companyPlan;
  }

  async findOneByCompanyId(companyId: number): Promise<CompanyPlanEntity> {
    const companyPlan = await this.companyPlanRepository.findOne({
      where: { CompanyId: companyId },
      relations: ['Company', 'Plan', 'CompanyPlanControlTokens']
    });

    if (!companyPlan) {
      throw new NotFoundException(`CompanyPlan para la empresa con ID ${companyId} no encontrado`);
    }

    return companyPlan;
  }

  async update(id: number, updateCompanyPlanDto: UpdateCompanyPlanDto): Promise<CompanyPlanEntity> {
    await this.findOne(id);
    await this.companyPlanRepository.update(id, updateCompanyPlanDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const companyPlan = await this.findOne(id);
    await this.companyPlanRepository.remove(companyPlan);
  }
}