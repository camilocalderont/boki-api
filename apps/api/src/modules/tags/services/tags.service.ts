import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsEntity } from '../entities/tags.entity';
import { CreateTagsDto } from '../dto/tagsCreate.dto';
import { TagsRepository } from '../repositories/tags.repository';
import { UpdateTagsDto } from '../dto/tagsUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class TagsService extends BaseCrudService<TagsEntity, CreateTagsDto, UpdateTagsDto> {
    constructor(
        @InjectRepository(TagsEntity)
        private readonly tagsEntityRepository: Repository<TagsEntity>,
        @Inject(TagsRepository)
        private readonly tagsRepository: TagsRepository
    ) {
        super(tagsEntityRepository);
    }
    protected async validateCreate(createTagsDto: CreateTagsDto): Promise<void> {
        const errors: ApiErrorItem[] = [];

        const existingTag = await this.tagsEntityRepository.findOne({
            where: { VcName: createTagsDto.VcName }
        });

        if (existingTag) {
            errors.push({
                code: 'ETIQUETA_YA_EXISTE',
                message: 'Ya existe un etiqueta con este nombre.',
                field: 'VcName'
            });
        }

        const existingUserByIdentification = await this.tagsEntityRepository.findOne({
            where: { VcName: createTagsDto.VcName }
        });

        if (existingUserByIdentification) {
            errors.push({
                code: 'ETIQUETA_YA_EXISTE',
                message: 'Ya existe un etiqueta con este número de nombre.',
                field: 'VcName'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la creación del etiqueta");
        }
    }


    async create(createTagsDto: CreateTagsDto): Promise<TagsEntity> {
        try {
            await this.validateCreate(createTagsDto);
            const entity = this.tagsEntityRepository.create(createTagsDto);
            return await this.tagsEntityRepository.save(entity);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_ETIQUETA',
                        message: 'Ya existe un etiqueta con estos datos',
                        field: 'tag'
                    }],
                    'Ya existe un etiqueta con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_ETIQUETA',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'tag'
                }],
                'Ha ocurrido un error inesperado'
            );
        }
    }



    async update(id: number, updateTagsDto: UpdateTagsDto): Promise<TagsEntity> {
        try {
            return await super.update(id, updateTagsDto);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_ETIQUETA',
                        message: 'Ya existe un etiqueta con estos datos',
                        field: 'tag'
                    }],
                    'Ya existe un etiqueta con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_ACTUALIZACION_ETIQUETA',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'tag'
                }],
                'Ha ocurrido un error inesperado'
            );
        }
    }
}
