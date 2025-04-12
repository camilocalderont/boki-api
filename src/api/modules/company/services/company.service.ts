import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/companyCreate.dto';
import { UpdateCompanyDto } from '../dto/companyUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';

@Injectable()
export class CompanyService extends BaseCrudService<CompanyEntity, CreateCompanyDto, UpdateCompanyDto> {
    constructor(
        @InjectRepository(CompanyEntity)
        private readonly companyRepository: Repository<CompanyEntity>
    ) {
        super(companyRepository);
    }

    protected async validateCreate(createCompanyDto: CreateCompanyDto): Promise<void> {
        const existingCompany = await this.companyRepository.findOne({
            where: { VcPrincipalEmail: createCompanyDto.VcPrincipalEmail }
        });

        if (existingCompany) {
            throw new ConflictException('Email already exists in the system');
        }
    }

    async create(createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
        try {
            await this.validateCreate(createCompanyDto);
            
            const entity = this.companyRepository.create(createCompanyDto as any);
            const savedEntity = await this.companyRepository.save(entity as any);
            
            await this.afterCreate(savedEntity as CompanyEntity);
            
            return savedEntity;
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException('A company with this data already exists');
            }

            console.error('Error in create:', error);
            throw error;
        }
    }

    protected async validateUpdate(id: number, updateCompanyDto: UpdateCompanyDto): Promise<void> {
        try {
            const company = await this.findOne(id);
            
            if (updateCompanyDto.VcPrincipalEmail && updateCompanyDto.VcPrincipalEmail !== company.VcPrincipalEmail) {
                const existingCompany = await this.companyRepository.findOne({
                    where: { VcPrincipalEmail: updateCompanyDto.VcPrincipalEmail }
                });

                if (existingCompany) {
                    throw new ConflictException('The email already exists in the system');
                }
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Error validating company with ID ${id}: ${error.message}`);
        }
    }
    
    async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<CompanyEntity> {
        try {
            return await super.update(id, updateCompanyDto);
        } catch (error) {
            if (error instanceof BadRequestException || 
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }
            
            if (error.code === '23505') { 
                throw new ConflictException('A company with this data already exists');
            }
            
            console.error('Error in update:', error);
            throw error;
        }
    }
}
