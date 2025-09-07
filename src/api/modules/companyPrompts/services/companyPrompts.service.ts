import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyPromptsEntity } from '../entities/companyPrompts.entity';
import { CreateCompanyPromptsDto } from '../dto/companyPromptsCreate.dto';
import { UpdateCompanyPromptsDto } from '../dto/companyPromptsUpdate.dto';
import { ICrudService } from '../../../shared/interfaces/crud.interface';

@Injectable()
export class CompanyPromptsService implements ICrudService<CompanyPromptsEntity, CreateCompanyPromptsDto, UpdateCompanyPromptsDto> {
  constructor(
    @InjectRepository(CompanyPromptsEntity)
    private readonly companyPromptsRepository: Repository<CompanyPromptsEntity>,
  ) {}

  async create(createCompanyPromptsDto: CreateCompanyPromptsDto): Promise<CompanyPromptsEntity> {
    const companyPrompt = this.companyPromptsRepository.create(createCompanyPromptsDto);
    return await this.companyPromptsRepository.save(companyPrompt);
  }

  async findAll(filters?: any): Promise<CompanyPromptsEntity[]> {
    return await this.companyPromptsRepository.find({
      where: filters,
      relations: ['Company', 'User']
    });
  }

  async findOne(id: number): Promise<CompanyPromptsEntity> {
    const companyPrompt = await this.companyPromptsRepository.findOne({
      where: { Id: id },
      relations: ['Company', 'User']
    });
    
    if (!companyPrompt) {
      throw new NotFoundException(`CompanyPrompt con ID ${id} no encontrado`);
    }
    
    return companyPrompt;
  }

  async update(id: number, updateCompanyPromptsDto: UpdateCompanyPromptsDto): Promise<CompanyPromptsEntity> {
    await this.findOne(id);
    await this.companyPromptsRepository.update(id, updateCompanyPromptsDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const companyPrompt = await this.findOne(id);
    await this.companyPromptsRepository.remove(companyPrompt);
  }
}