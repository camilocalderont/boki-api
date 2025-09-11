import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaqsEntity } from '../entities/faqs.entity';
import { CreateFaqsDto } from '../dto/faqsCreate.dto';
import { FaqsRepository } from '../repositories/faqs.repository';
import { UpdateFaqsDto } from '../dto/faqsUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';
import { CompanyEntity } from '../../company/entities/company.entity';
import { CategoryServiceEntity } from '../../categoryService/entities/categoryService.entity';

@Injectable()
export class FaqsService extends BaseCrudService<FaqsEntity, CreateFaqsDto, UpdateFaqsDto> {
    constructor(
        @InjectRepository(FaqsEntity)
        private readonly faqsEntityRepository: Repository<FaqsEntity>,
        @Inject(FaqsRepository)
        private readonly faqsRepository: FaqsRepository,
        @InjectRepository(CompanyEntity)
        private readonly companyRepository: Repository<CompanyEntity>,
        @InjectRepository(CategoryServiceEntity)
        private readonly categoryServiceRepository: Repository<CategoryServiceEntity>,
    ) {
        super(faqsEntityRepository);
    }

    async findAll(filters?: Record<string, any>): Promise<FaqsEntity[]> {
        try {
            return await this.faqsRepository.findAll(filters);
        } catch (error) {
            console.error('Error in findAll:', error);
            throw new BadRequestException('Error obteniendo las preguntas frecuentes');
        }
    }

    protected async validateSave(dto: CreateFaqsDto | UpdateFaqsDto, id?: number): Promise<void> {
        const errors: ApiErrorItem[] = [];

        // Verificamos si existe la compañía
        const existingCompany = await this.companyRepository.findOne({
            where: { Id: dto.CompanyId }
        });
        if (!existingCompany) {
            errors.push({
                code: 'COMPANIA_NO_EXISTE',
                message: 'La compañía especificada no existe.',
                field: 'CompanyId'
            });
        }

        // Verificamos si existe la categoría de servicio
        const existingCategory = await this.categoryServiceRepository.findOne({
            where: { Id: dto.CategoryServiceId }
        });
        if (!existingCategory) {
            errors.push({
                code: 'CATEGORIA_NO_EXISTE',
                message: 'La categoría de servicio especificada no existe.',
                field: 'CategoryServiceId'
            });
        }

        const existingFaq = await this.faqsEntityRepository.findOne({
            where: { CompanyId: dto.CompanyId, CategoryServiceId: dto.CategoryServiceId, VcQuestion: dto.VcQuestion }
        });

        if (existingFaq) {
            errors.push({
                code: 'FAQ_YA_EXISTE',
                message: 'Ya existe una pregunta frecuente con estos datos para esta compañía y categoría.',
                field: 'VcQuestion'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la operación con pregunta frecuente");
        }
    }

    async create(createFaqsDto: CreateFaqsDto): Promise<FaqsEntity> {
        try {
            await this.validateSave(createFaqsDto);
            const entity = this.faqsEntityRepository.create(createFaqsDto);
            return await this.faqsEntityRepository.save(entity);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'FAQ_YA_EXISTE',
                        message: 'Ya existe una pregunta frecuente con estos datos',
                        field: 'faq'
                    }],
                    'Ya existe una pregunta frecuente con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_FAQ',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'faq'
                }],
                'Ha ocurrido un error inesperado'
            );
        }
    }

    async update(id: number, updateFaqsDto: UpdateFaqsDto): Promise<FaqsEntity> {
        try {
            await this.validateSave(updateFaqsDto, id);
            return await super.update(id, updateFaqsDto);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'FAQ_YA_EXISTE',
                        message: 'Ya existe una pregunta frecuente con estos datos',
                        field: 'faq'
                    }],
                    'Ya existe una pregunta frecuente con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_ACTUALIZACION_FAQ',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'faq'
                }],
                'Ha ocurrido un error inesperado'
            );
        }
    }
}

