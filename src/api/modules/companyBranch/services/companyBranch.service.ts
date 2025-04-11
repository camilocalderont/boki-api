import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CompanyBranchEntity } from '../entities/companyBranch.entity';
import { CreateCompanyBranchDto } from '../dto/companyBranchCreate.dto';
import { UpdateCompanyBranchDto } from '../dto/companyBranchUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { CompanyEntity } from '../../company/entities/company.entity';

@Injectable()
export class CompanyBranchService extends BaseCrudService<CompanyBranchEntity, CreateCompanyBranchDto, UpdateCompanyBranchDto> {
    constructor(
        @InjectRepository(CompanyBranchEntity)
        private readonly companyBranchRepository: Repository<CompanyBranchEntity>,
        @InjectRepository(CompanyEntity)
        private readonly companyRepository: Repository<CompanyEntity>
    ) {
        super(companyBranchRepository);
    }

    protected async validateCreate(createCompanyBranchDto: CreateCompanyBranchDto): Promise<void> {
        const company = await this.companyRepository.findOne({
            where: { Id: createCompanyBranchDto.CompanyId }
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${createCompanyBranchDto.CompanyId} not found`);
        }

        if (createCompanyBranchDto.BIsPrincipal) {
            const existingPrincipal = await this.companyBranchRepository.findOne({
                where: { 
                    CompanyId: createCompanyBranchDto.CompanyId,
                    BIsPrincipal: true
                }
            });

            if (existingPrincipal) {
                throw new ConflictException('A principal branch already exists for this company');
            }
        }

        if (createCompanyBranchDto.VcEmail) {
            const existingBranch = await this.companyBranchRepository.findOne({
                where: { VcEmail: createCompanyBranchDto.VcEmail }
            });

            if (existingBranch) {
                throw new ConflictException('This email already exists in the system');
            }
        }
    }

    async create(createCompanyBranchDto: CreateCompanyBranchDto): Promise<CompanyBranchEntity> {
        try {
            await this.validateCreate(createCompanyBranchDto);
            
            const entity = this.companyBranchRepository.create(createCompanyBranchDto);
            const savedEntity = await this.companyBranchRepository.save(entity);
            
            await this.afterCreate(savedEntity);
            
            return savedEntity;
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException('A branch with this data already exists');
            }

            if (error.code === '23503') {
                throw new BadRequestException(`Company with ID ${createCompanyBranchDto.CompanyId} does not exist`);
            }

            console.error('Error en create:', error);
            throw error;
        }
    }

    protected async validateUpdate(id: number, updateCompanyBranchDto: UpdateCompanyBranchDto): Promise<void> {
        try {
            const branch = await this.findOne(id);
            
            if (updateCompanyBranchDto.CompanyId && updateCompanyBranchDto.CompanyId !== branch.CompanyId) {
                const company = await this.companyRepository.findOne({
                    where: { Id: updateCompanyBranchDto.CompanyId }
                });

                if (!company) {
                    throw new NotFoundException(`Company with ID ${updateCompanyBranchDto.CompanyId} not found`);
                }
            }
            
            if (updateCompanyBranchDto.BIsPrincipal && !branch.BIsPrincipal) {
                const companyId = updateCompanyBranchDto.CompanyId || branch.CompanyId;
                const existingPrincipal = await this.companyBranchRepository.findOne({
                    where: { 
                        CompanyId: companyId,
                        BIsPrincipal: true,
                        Id: Not(id)
                    }
                });

                if (existingPrincipal) {
                    throw new ConflictException('A principal branch already exists for this company');
                }
            }
            
            if (updateCompanyBranchDto.VcEmail && updateCompanyBranchDto.VcEmail !== branch.VcEmail) {
                const existingBranch = await this.companyBranchRepository.findOne({
                    where: { VcEmail: updateCompanyBranchDto.VcEmail }
                });

                if (existingBranch) {
                    throw new ConflictException('This email already exists in the system');
                }
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Error validating branch with ID ${id}: ${error.message}`);
        }
    }
    
    async update(id: number, updateCompanyBranchDto: UpdateCompanyBranchDto): Promise<CompanyBranchEntity> {
        try {
            return await super.update(id, updateCompanyBranchDto);
        } catch (error) {
            if (error instanceof BadRequestException || 
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }
            
            if (error.code === '23505') { 
                throw new ConflictException('A branch with this data already exists');
            }
            
            if (error.code === '23503') {
                throw new BadRequestException(`The specified company does not exist`);
            }
            
            console.error('Error en update:', error);
            throw error;
        }
    }

    async findByCompany(companyId: number): Promise<any> {
        const company = await this.companyRepository.findOne({
            where: { Id: companyId }
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${companyId} not found`);
        }

        const branches = await this.companyBranchRepository.find({
            where: { CompanyId: companyId }
        });
        
        if (!branches || branches.length === 0) {
            throw new NotFoundException(`No branches found for company with ID ${companyId}`);
        }
        
        return {
            company: {
                Id: company.Id,
                VcName: company.VcName,
                VcLogo: company.VcLogo
            },
            branches: branches.map(branch => ({
                Id: branch.Id,
                VcName: branch.VcName,
                VcDescription: branch.VcDescription,
                VcAddress: branch.VcAddress,
                VcEmail: branch.VcEmail,
                VcPhone: branch.VcPhone,
                VcBranchManagerName: branch.VcBranchManagerName,
                VcImage: branch.VcImage,
                BIsPrincipal: branch.BIsPrincipal,
                created_at: branch.created_at,
                updated_at: branch.updated_at
            }))
        };
    }

    async findPrincipalByCompany(companyId: number): Promise<any> {
        const company = await this.companyRepository.findOne({
            where: { Id: companyId }
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${companyId} not found`);
        }

        const branch = await this.companyBranchRepository.findOne({
            where: { 
                CompanyId: companyId,
                BIsPrincipal: true
            }
        });
        
        if (!branch) {
            throw new NotFoundException(`No principal branch found for company with ID ${companyId}`);
        }
        
        return {
            company: {
                Id: company.Id,
                VcName: company.VcName,
                VcLogo: company.VcLogo
            },
            branch: {
                Id: branch.Id,
                VcName: branch.VcName,
                VcDescription: branch.VcDescription,
                VcAddress: branch.VcAddress,
                VcEmail: branch.VcEmail,
                VcPhone: branch.VcPhone,
                VcBranchManagerName: branch.VcBranchManagerName,
                VcImage: branch.VcImage,
                BIsPrincipal: branch.BIsPrincipal,
                created_at: branch.created_at,
                updated_at: branch.updated_at
            }
        };
    }
}
