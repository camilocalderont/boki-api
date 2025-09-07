import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from '../entities/plan.entity';
import { CreatePlanDto } from '../dto/planCreate.dto';
import { UpdatePlanDto } from '../dto/planUpdate.dto';
import { ICrudService } from '../../../shared/interfaces/crud.interface';

@Injectable()
export class PlanService implements ICrudService<PlanEntity, CreatePlanDto, UpdatePlanDto> {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<PlanEntity> {
    const plan = this.planRepository.create(createPlanDto);
    return await this.planRepository.save(plan);
  }

  async findAll(filters?: any): Promise<PlanEntity[]> {
    return await this.planRepository.find({
      where: filters,
      relations: ['CompanyPlans']
    });
  }

  async findOne(id: number): Promise<PlanEntity> {
    const plan = await this.planRepository.findOne({
      where: { Id: id },
      relations: ['CompanyPlans']
    });
    
    if (!plan) {
      throw new NotFoundException(`Plan con ID ${id} no encontrado`);
    }
    
    return plan;
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<PlanEntity> {
    await this.findOne(id);
    await this.planRepository.update(id, updatePlanDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const plan = await this.findOne(id);
    await this.planRepository.remove(plan);
  }
}