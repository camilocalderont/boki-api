import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplatesEntity } from '../entities/email-templates.entity';
import { CreateEmailTemplatesDto } from '../dto/email-templates-create.dto';
import { UpdateEmailTemplatesDto } from '../dto/email-templates-update.dto';
import { EmailTemplatesRepository } from '../repositories/email-templates.repository';
import { EmbeddingService } from '../../semanticSearch/embedding/embedding.service';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class EmailTemplatesService extends BaseCrudService<
    EmailTemplatesEntity,
    CreateEmailTemplatesDto,
    UpdateEmailTemplatesDto
> {
    constructor(
        @InjectRepository(EmailTemplatesEntity)
        private readonly emailTemplatesEntityRepository: Repository<EmailTemplatesEntity>,
        @Inject(EmailTemplatesRepository)
        private readonly emailTemplatesRepository: EmailTemplatesRepository,
        @Inject(EmbeddingService)
        private readonly embeddingService: EmbeddingService
    ) {
        super(emailTemplatesEntityRepository);
    }

    protected async validateCreate(createDto: CreateEmailTemplatesDto): Promise<void> {
        const errors: ApiErrorItem[] = [];

        const existingTemplate = await this.emailTemplatesEntityRepository.findOne({
            where: {
                CategoryName: createDto.CategoryName,
                CompanyId: createDto.CompanyId
            }
        });

        if (existingTemplate) {
            errors.push({
                code: 'TEMPLATE_YA_EXISTE',
                message: 'Ya existe un template con este nombre de categoría para esta empresa.',
                field: 'CategoryName'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la creación del template");
        }
    }

    async create(createDto: CreateEmailTemplatesDto): Promise<EmailTemplatesEntity> {
        try {
            await this.validateCreate(createDto);

            // Generar embedding antes de crear
            const { embedding } = await this.embeddingService.generateEmbedding(createDto.ContextDescription);

            const entity = this.emailTemplatesEntityRepository.create({
                ...createDto,
                Embedding: embedding
            } as any);

            const savedEntity = await this.emailTemplatesEntityRepository.save(entity as any);

            await this.afterCreate(savedEntity as EmailTemplatesEntity);

            return savedEntity;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_TEMPLATE',
                        message: 'Ya existe un template con estos datos',
                        field: 'template'
                    }],
                    'Ya existe un template con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_TEMPLATE',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'template'
                }],
                'Ha ocurrido un error inesperado'
            );
        }
    }

    protected async validateUpdate(id: number, updateDto: UpdateEmailTemplatesDto): Promise<void> {
        const errors: ApiErrorItem[] = [];

        let template: EmailTemplatesEntity;
        try {
            template = await this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException([{
                    code: 'TEMPLATE_NO_EXISTE',
                    message: `El template con ID ${id} no existe`,
                    field: 'id'
                }], `El template con ID ${id} no existe`);
            }
            throw error;
        }

        if (updateDto.CategoryName && updateDto.CategoryName !== template.CategoryName) {
            const existingTemplate = await this.emailTemplatesEntityRepository.findOne({
                where: {
                    CategoryName: updateDto.CategoryName,
                    CompanyId: template.CompanyId
                }
            });

            if (existingTemplate) {
                errors.push({
                    code: 'TEMPLATE_YA_EXISTE',
                    message: 'Ya existe un template con este nombre de categoría.',
                    field: 'CategoryName'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la actualización del template");
        }
    }

    protected async prepareUpdateData(
        entity: EmailTemplatesEntity,
        updateDto: UpdateEmailTemplatesDto
    ): Promise<Partial<EmailTemplatesEntity>> {
        const preparedData: any = { ...updateDto };

        // Si se actualiza la descripción, regenerar el embedding
        if (updateDto.ContextDescription) {
            const { embedding } = await this.embeddingService.generateEmbedding(updateDto.ContextDescription);
            preparedData.Embedding = embedding;
        }

        return preparedData;
    }

    async findByCompanyId(companyId: number): Promise<EmailTemplatesEntity[]> {
        return this.emailTemplatesRepository.findByCompanyId(companyId);
    }

    async regenerateEmbeddings(companyId?: number): Promise<{ processed: number; message: string }> {
        const templates = await this.emailTemplatesRepository.findWithoutEmbeddings(companyId);

        let processed = 0;

        for (const template of templates) {
            try {
                const { embedding } = await this.embeddingService.generateEmbedding(template.ContextDescription);

                await this.emailTemplatesEntityRepository.update(template.Id, {
                    Embedding: embedding as any
                });

                processed++;
            } catch (error) {
                console.error(`Error processing template ${template.Id}:`, error);
            }
        }

        return {
            processed,
            message: `Successfully regenerated embeddings for ${processed} templates`
        };
    }
}