import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProfessionalEntity } from '../entities/professional.entity';
import { ProfessionalBussinessHourEntity } from '../entities/professionalBussinessHour.entity';
import { ProfessionalServiceEntity } from '../entities/professionalService.entity';
import { CreateProfessionalDto } from '../dto/professionalCreate.dto';
import { UpdateProfessionalDto } from '../dto/professionalUpdate.dto';
import { CreateProfessionalBussinessHourDto } from '../dto/professionalBussinessHourCreate.dto';
import { CreateProfessionalServiceDto } from '../dto/professionalServiceCreate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';
import { ProfessionalBussinessHourService } from './professionalBussinessHour.service';
import { ProfessionalServiceService } from './professionalService.service';

@Injectable()
export class ProfessionalService extends BaseCrudService<ProfessionalEntity, CreateProfessionalDto, UpdateProfessionalDto> {
    constructor(
        @InjectRepository(ProfessionalEntity)
        private readonly professionalRepository: Repository<ProfessionalEntity>,
        @InjectRepository(ProfessionalBussinessHourEntity)
        private readonly professionalBussinessHourRepository: Repository<ProfessionalBussinessHourEntity>,
        @InjectRepository(ProfessionalServiceEntity)
        private readonly professionalServiceRepository: Repository<ProfessionalServiceEntity>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @Inject(ProfessionalBussinessHourService)
        private readonly professionalBussinessHourService: ProfessionalBussinessHourService,
        @Inject(ProfessionalServiceService)
        private readonly professionalServiceService: ProfessionalServiceService
    ) {
        super(professionalRepository);
    }

    protected async validateCreate(createProfessionalDto: CreateProfessionalDto): Promise<void> {
        const errors: ApiErrorItem[] = [];
        const existingEmail = await this.professionalRepository.findOne({
            where: { VcEmail: createProfessionalDto.VcEmail }
        });

        if (existingEmail) {
            errors.push({
                code: 'EMAIL_YA_EXISTE',
                message: 'Ya existe un profesional con este correo electrónico.',
                field: 'VcEmail'
            });
        }

        const existingId = await this.professionalRepository.findOne({
            where: { VcIdentificationNumber: createProfessionalDto.VcIdentificationNumber }
        });

        if (existingId) {
            errors.push({
                code: 'IDENTIFICACION_YA_EXISTE',
                message: 'Ya existe un profesional con este número de identificación.',
                field: 'VcIdentificationNumber'
            });
        }

        const existingPhone = await this.professionalRepository.findOne({
            where: { VcPhone: createProfessionalDto.VcPhone }
        });

        if (existingPhone) {
            errors.push({
                code: 'TELEFONO_YA_EXISTE',
                message: 'Ya existe un profesional con este número de teléfono.',
                field: 'VcPhone'
            });
        }

        const existingLicense = await this.professionalRepository.findOne({
            where: { VcLicenseNumber: createProfessionalDto.VcLicenseNumber }
        });

        if (existingLicense) {
            errors.push({
                code: 'LICENSE_YA_EXISTE',
                message: 'Ya existe un profesional con este número de licencia.',
                field: 'VcLicenseNumber'
            });
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la creación del profesional");
        }
    }

    async create(createProfessionalDto: CreateProfessionalDto): Promise<ProfessionalEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.validateCreate(createProfessionalDto);
            const { BussinessHours, Services, ...professionalData } = createProfessionalDto;
            const entity = this.professionalRepository.create(professionalData);
            const savedEntity = await queryRunner.manager.save(entity);

            if (BussinessHours && Array.isArray(BussinessHours) && BussinessHours.length > 0) {
                const bussinessHourEntities = await this.professionalBussinessHourService.createMany(
                    queryRunner,
                    savedEntity.Id,
                    BussinessHours
                );
                savedEntity.BussinessHours = bussinessHourEntities;
            }

            if (Services && Array.isArray(Services) && Services.length > 0) {
                const serviceEntities = await this.professionalServiceService.createMany(
                    queryRunner,
                    savedEntity.Id,
                    Services
                );
                savedEntity.Services = serviceEntities;
            }

            await queryRunner.commitTransaction();
            await this.afterCreate(savedEntity);

            return savedEntity;

        } catch (error) {
            await queryRunner.rollbackTransaction();

            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_PROFESSIONAL',
                        message: 'Ya existe un profesional con estos datos',
                        field: 'professional'
                    }],
                    'Ya existe un profesional con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_CREACION_PROFESIONAL',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'professional'
                }],
                'Ha ocurrido un error inesperado'
            );
        } finally {
            await queryRunner.release();
        }
    }

    protected async validateUpdate(id: number, updateProfessionalDto: UpdateProfessionalDto): Promise<void> {
        const errors: ApiErrorItem[] = [];

        let professional: ProfessionalEntity;
        try {
            professional = await this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException([
                    {
                        code: 'PROFESSIONAL_NO_EXISTE',
                        message: `El profesional con ID ${id} no existe`,
                        field: 'id'
                    }
                ], `El profesional con ID ${id} no existe`);
            }
            throw error;
        }

        if (updateProfessionalDto.VcEmail && updateProfessionalDto.VcEmail !== professional.VcEmail) {
            const existingEmail = await this.professionalRepository.findOne({
                where: { VcEmail: updateProfessionalDto.VcEmail }
            });

            if (existingEmail) {
                errors.push({
                    code: 'EMAIL_YA_EXISTE',
                    message: 'Ya existe un profesional con este correo electrónico.',
                    field: 'VcEmail'
                });
            }
        }

        if (updateProfessionalDto.VcIdentificationNumber &&
            updateProfessionalDto.VcIdentificationNumber !== professional.VcIdentificationNumber) {
            const existingId = await this.professionalRepository.findOne({
                where: { VcIdentificationNumber: updateProfessionalDto.VcIdentificationNumber }
            });

            if (existingId) {
                errors.push({
                    code: 'IDENTIFICACION_YA_EXISTE',
                    message: 'Ya existe un profesional con este número de identificación.',
                    field: 'VcIdentificationNumber'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la actualización del profesional");
        }
    }

    async update(id: number, updateProfessionalDto: UpdateProfessionalDto): Promise<ProfessionalEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.validateUpdate(id, updateProfessionalDto);
            const { BussinessHours, Services, ...professionalData } = updateProfessionalDto;
            const existingEntity = await queryRunner.manager.findOne(ProfessionalEntity, {
                where: { Id: id }
            });
            if (!existingEntity) {
                throw new NotFoundException(`El profesional con ID ${id} no existe`);
            }

            Object.assign(existingEntity, professionalData);
            const updatedEntity = await queryRunner.manager.save(existingEntity);

            if (BussinessHours && Array.isArray(BussinessHours) && BussinessHours.length > 0) {
                await queryRunner.manager.delete(ProfessionalBussinessHourEntity, {
                    ProfessionalId: id
                });
                const createBusinessHoursDtos = BussinessHours.map(dto => {
                    if (!dto.IDayOfWeek || !dto.TStartTime || !dto.TEndTime || !dto.CompanyBranchRoomId) {
                        throw new BadRequestException([
                            {
                                code: 'DATOS_INCOMPLETOS',
                                message: 'Los horarios deben tener día, hora de inicio, hora de fin y sala asignada',
                                field: 'BussinessHours'
                            }
                        ]);
                    }

                    return {
                        IDayOfWeek: dto.IDayOfWeek,
                        TStartTime: dto.TStartTime,
                        TEndTime: dto.TEndTime,
                        TBreakStartTime: dto.TBreakStartTime,
                        TBreakEndTime: dto.TBreakEndTime,
                        VcNotes: dto.VcNotes,
                        CompanyBranchRoomId: dto.CompanyBranchRoomId
                    } as CreateProfessionalBussinessHourDto;
                });

                const bussinessHourEntities = await this.professionalBussinessHourService.createMany(
                    queryRunner,
                    updatedEntity.Id,
                    createBusinessHoursDtos
                );
                updatedEntity.BussinessHours = bussinessHourEntities;
            }

            if (Services && Array.isArray(Services) && Services.length > 0) {
                await queryRunner.manager.delete(ProfessionalServiceEntity, {
                    ProfessionalId: id
                });
                const createServiceDtos = Services.map(dto => {
                    if (!dto.ServiceId) {
                        throw new BadRequestException([
                            {
                                code: 'DATOS_INCOMPLETOS',
                                message: 'Los servicios deben tener un ID de servicio',
                                field: 'Services'
                            }
                        ]);
                    }

                    return {
                        ServiceId: dto.ServiceId
                    } as CreateProfessionalServiceDto;
                });
                const serviceEntities = await this.professionalServiceService.createMany(
                    queryRunner,
                    updatedEntity.Id,
                    createServiceDtos
                );
                updatedEntity.Services = serviceEntities;
            }

            await queryRunner.commitTransaction();

            return updatedEntity;
        } catch (error) {
            await queryRunner.rollbackTransaction();

            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'YA_EXISTE_PROFESSIONAL',
                        message: 'Ya existe un profesional con estos datos',
                        field: 'professional'
                    }],
                    'Ya existe un profesional con estos datos'
                );
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_ACTUALIZACION_PROFESIONAL',
                    message: `Ha ocurrido un error inesperado: ${error.message || 'Error desconocido'}`,
                    field: 'professional'
                }],
                'Ha ocurrido un error inesperado'
            );
        } finally {
            await queryRunner.release();
        }
    }

    async findBySpecialization(specialization: string): Promise<ProfessionalEntity[]> {
        try {
            const professionals = await this.professionalRepository.find({
                where: { VcSpecialization: specialization }
            });

            if (!professionals || professionals.length === 0) {
                throw new NotFoundException([
                    {
                        code: 'PROFESIONALES_NO_ENCONTRADOS',
                        message: `No se encontraron profesionales con la especialización: ${specialization}`,
                        field: 'VcSpecialization'
                    }
                ], `No se encontraron profesionales con la especialización: ${specialization}`);
            }

            return professionals;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_BUSQUEDA_PROFESIONALES',
                    message: `Ha ocurrido un error al buscar profesionales: ${error.message || 'Error desconocido'}`,
                    field: 'professional'
                }],
                'Ha ocurrido un error al buscar profesionales'
            );
        }
    }

    async findByExperienceYears(years: number): Promise<ProfessionalEntity[]> {
        try {
            const professionals = await this.professionalRepository.find({
                where: { IYearsOfExperience: years }
            });

            if (!professionals || professionals.length === 0) {
                throw new NotFoundException([
                    {
                        code: 'PROFESIONALES_NO_ENCONTRADOS',
                        message: `No se encontraron profesionales con ${years} años de experiencia`,
                        field: 'IYearsOfExperience'
                    }
                ], `No se encontraron profesionales con ${years} años de experiencia`);
            }

            return professionals;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_BUSQUEDA_PROFESIONALES',
                    message: `Ha ocurrido un error al buscar profesionales: ${error.message || 'Error desconocido'}`,
                    field: 'professional'
                }],
                'Ha ocurrido un error al buscar profesionales'
            );
        }
    }
}
