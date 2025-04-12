import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/companyCreate.dto';
import { UpdateCompanyDto } from '../dto/companyUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

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

        const errors: ApiErrorItem[] = [];

        if (existingCompany) {
            errors.push({
                code: 'EMAIL_ALREADY_EXISTS',
                message: 'There is already a company with this email.',
                field: 'VcPrincipalEmail'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "There is already a company with these data");
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
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: '23505',
                        message: 'There is already a company with these data',
                        field: 'company'
                    }],
                    'There is already a company with these data'
                );
            }

            throw new BadRequestException('An unexpected error occurred', error);
        }
    }

    protected async validateUpdate(id: number, updateCompanyDto: UpdateCompanyDto): Promise<void> {
        const company = await this.findOne(id);

        if (updateCompanyDto.VcPrincipalEmail && updateCompanyDto.VcPrincipalEmail !== company.VcPrincipalEmail) {
            const existingCompany = await this.companyRepository.findOne({
                where: { VcPrincipalEmail: updateCompanyDto.VcPrincipalEmail }
            });
            const errors: ApiErrorItem[] = [];

            if (existingCompany) {
                errors.push({
                    code: 'EMAIL_ALREADY_EXISTS',
                    message: 'There is already a company with this email.',
                    field: 'VcPrincipalEmail'
                });
            }

            if (errors.length > 0) {
                throw new ConflictException(errors, "There is already a company with these data");
            }
        }
    }

    async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<CompanyEntity> {
        try {
            return await super.update(id, updateCompanyDto);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: '23505',
                        message: 'There is already a company with these data',
                        field: 'company'
                    }],
                    'There is already a company with these data'
                );
            }

            throw new BadRequestException('An unexpected error occurred', error);
        }
    }
}
