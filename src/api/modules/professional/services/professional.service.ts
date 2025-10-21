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
import { ProfessionalRepository } from '../repositories/professional.repository';
import { Between, Not } from 'typeorm';
import { parseISO, set, getDay, startOfDay, endOfDay, isBefore, addMinutes, areIntervalsOverlapping } from 'date-fns';

@Injectable()
export class ProfessionalService extends BaseCrudService<ProfessionalEntity, CreateProfessionalDto, UpdateProfessionalDto> {
    constructor(
        @InjectRepository(ProfessionalEntity)
        private readonly professionalTypeOrmRepo: Repository<ProfessionalEntity>,
        @InjectRepository(ProfessionalBussinessHourEntity)
        private readonly professionalBussinessHourRepository: Repository<ProfessionalBussinessHourEntity>,
        @InjectRepository(ProfessionalServiceEntity)
        private readonly professionalServiceRepository: Repository<ProfessionalServiceEntity>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @Inject(ProfessionalBussinessHourService)
        private readonly professionalBussinessHourService: ProfessionalBussinessHourService,
        @Inject(ProfessionalServiceService)
        private readonly professionalServiceService: ProfessionalServiceService,
        @Inject(ProfessionalRepository)
        private readonly professionalRepository: ProfessionalRepository
    ) {
        super(professionalTypeOrmRepo);
    }

    protected async validateCreate(createProfessionalDto: CreateProfessionalDto): Promise<void> {
        const errors: ApiErrorItem[] = [];

        const company = await this.dataSource.getRepository('Company').findOne({
            where: { Id: createProfessionalDto.CompanyId }
        });

        if (!company) {
            errors.push({
                code: 'COMPANY_NO_EXISTE',
                message: 'La compañía especificada no existe.',
                field: 'CompanyId'
            });
        }

        const existingEmail = await this.professionalTypeOrmRepo.findOne({
            where: { VcEmail: createProfessionalDto.VcEmail, CompanyId: createProfessionalDto.CompanyId }
        });

        if (existingEmail) {
            errors.push({
                code: 'EMAIL_YA_EXISTE',
                message: 'Ya existe un profesional con este correo electrónico.',
                field: 'VcEmail'
            });
        }

        const existingId = await this.professionalTypeOrmRepo.findOne({
            where: { VcIdentificationNumber: createProfessionalDto.VcIdentificationNumber, CompanyId: createProfessionalDto.CompanyId }
        });

        if (existingId) {
            errors.push({
                code: 'IDENTIFICACION_YA_EXISTE',
                message: 'Ya existe un profesional con este número de identificación.',
                field: 'VcIdentificationNumber'
            });
        }

        const existingPhone = await this.professionalTypeOrmRepo.findOne({
            where: { VcPhone: createProfessionalDto.VcPhone }
        });

        if (existingPhone) {
            errors.push({
                code: 'TELEFONO_YA_EXISTE',
                message: 'Ya existe un profesional con este número de teléfono.',
                field: 'VcPhone'
            });
        }

        const existingLicense = await this.professionalTypeOrmRepo.findOne({
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
            const entity = this.professionalTypeOrmRepo.create(professionalData);
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

        if (updateProfessionalDto.CompanyId && updateProfessionalDto.CompanyId !== professional.CompanyId) {
            const company = await this.dataSource.getRepository('Company').findOne({
                where: { Id: updateProfessionalDto.CompanyId }
            });

            if (!company) {
                errors.push({
                    code: 'COMPANY_NO_EXISTE',
                    message: 'La compañía especificada no existe.',
                    field: 'CompanyId'
                });
            }
        }

        if (updateProfessionalDto.VcEmail && updateProfessionalDto.VcEmail !== professional.VcEmail) {
            const companyId = updateProfessionalDto.CompanyId || professional.CompanyId;
            const existingEmail = await this.professionalTypeOrmRepo.findOne({
                where: {
                    VcEmail: updateProfessionalDto.VcEmail,
                    CompanyId: companyId
                }
            });

            if (existingEmail && existingEmail.Id !== id) {
                errors.push({
                    code: 'EMAIL_YA_EXISTE_EN_COMPANY',
                    message: 'Ya existe un profesional con este correo electrónico en esta compañía.',
                    field: 'VcEmail'
                });
            }
        }

        if (updateProfessionalDto.VcIdentificationNumber &&
            updateProfessionalDto.VcIdentificationNumber !== professional.VcIdentificationNumber) {
            const companyId = updateProfessionalDto.CompanyId || professional.CompanyId;
            const existingId = await this.professionalTypeOrmRepo.findOne({
                where: {
                    VcIdentificationNumber: updateProfessionalDto.VcIdentificationNumber,
                    CompanyId: companyId
                }
            });

            if (existingId && existingId.Id !== id) {
                errors.push({
                    code: 'IDENTIFICACION_YA_EXISTE_EN_COMPANY',
                    message: 'Ya existe un profesional con este número de identificación en esta compañía.',
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

    async findByCompanyId(companyId: number): Promise<ProfessionalEntity[]> {
        try {
            const professionals = await this.professionalTypeOrmRepo.find({
                where: { CompanyId: companyId },
                relations: ['Services', 'BussinessHours']
            });

            if (!professionals || professionals.length === 0) {
                throw new NotFoundException([
                    {
                        code: 'PROFESIONALES_NO_ENCONTRADOS',
                        message: `No se encontraron profesionales para la compañía con ID: ${companyId}`,
                        field: 'CompanyId'
                    }
                ], `No se encontraron profesionales para la compañía con ID: ${companyId}`);
            }

            return professionals;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_BUSQUEDA_PROFESIONALES',
                    message: `Ha ocurrido un error al buscar profesionales por compañía: ${error.message || 'Error desconocido'}`,
                    field: 'CompanyId'
                }],
                'Ha ocurrido un error al buscar profesionales por compañía'
            );
        }
    }

    async findBySpecialization(specialization: string): Promise<ProfessionalEntity[]> {
        try {
            const professionals = await this.professionalTypeOrmRepo.find({
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
            const professionals = await this.professionalTypeOrmRepo.find({
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

    async findByServiceId(serviceId: number): Promise<ProfessionalEntity[]> {
        try {
            const professionals = await this.professionalRepository.findByServiceId(serviceId);

            if (!professionals || professionals.length === 0) {
                throw new NotFoundException([
                    {
                        code: 'PROFESIONALES_NO_ENCONTRADOS',
                        message: `No se encontraron profesionales que ofrezcan el servicio con ID: ${serviceId}`,
                        field: 'ServiceId'
                    }
                ], `No se encontraron profesionales que ofrezcan el servicio con ID: ${serviceId}`);
            }

            return professionals;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_BUSQUEDA_PROFESIONALES',
                    message: `Ha ocurrido un error al buscar profesionales por servicio: ${error.message || 'Error desconocido'}`,
                    field: 'professional'
                }],
                'Ha ocurrido un error al buscar profesionales por servicio'
            );
        }
    }

    async findGeneralAvailability(professionalId: number, startDate?: Date): Promise<any[]> {
        try {
            const professional = await this.findOne(professionalId);

            if (!professional) {
                throw new NotFoundException([
                    {
                        code: 'PROFESIONAL_NO_ENCONTRADO',
                        message: `No se encontró el profesional con ID: ${professionalId}`,
                        field: 'Id'
                    }
                ], `No se encontró el profesional con ID: ${professionalId}`);
            }

            const allAvailability = await this.professionalRepository.findGeneralAvailability(professionalId);

            if (!allAvailability || allAvailability.length === 0) {
                throw new NotFoundException([
                    {
                        code: 'HORARIOS_NO_ENCONTRADOS',
                        message: `No se encontraron horarios disponibles para el profesional con ID: ${professionalId}`,
                        field: 'ProfessionalId'
                    }
                ], `No se encontraron horarios disponibles para el profesional con ID: ${professionalId}`);
            }

            const availabilityByDay = new Map();
            for (const item of allAvailability) {
                availabilityByDay.set(item.diaNumero, item);
            }

            let baseDate;

            if (startDate) {
                if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
                    baseDate = new Date();
                } else {
                    baseDate = new Date(startDate.getTime());
                }
            } else {
                baseDate = new Date();
            }

            const dateString = baseDate.toISOString().split('T')[0];
            const [year, month, day] = dateString.split('-').map(Number);

            baseDate = new Date(year, month - 1, day);

            const nextWorkingDays = [];
            const diasDeSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

            let exactDateDayOfWeek = baseDate.getDay();
            exactDateDayOfWeek = exactDateDayOfWeek === 0 ? 7 : exactDateDayOfWeek;

            if (availabilityByDay.has(exactDateDayOfWeek)) {
                const availability = { ...availabilityByDay.get(exactDateDayOfWeek) };
                const formattedDate = this.formatDateToSpanish(baseDate);
                availability.fecha = formattedDate;
                availability.fechaCompleta = new Date(baseDate);
                nextWorkingDays.push(availability);
            }

            let currentDate = new Date(baseDate);
            currentDate.setDate(currentDate.getDate() + 1);

            while (nextWorkingDays.length < 5) {
                let dayOfWeek = currentDate.getDay();
                dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

                if (availabilityByDay.has(dayOfWeek)) {
                    const availability = { ...availabilityByDay.get(dayOfWeek) };
                    const formattedDate = this.formatDateToSpanish(currentDate);
                    availability.fecha = formattedDate;
                    availability.fechaCompleta = new Date(currentDate);

                    nextWorkingDays.push(availability);
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return nextWorkingDays;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_BUSQUEDA_DISPONIBILIDAD',
                    message: `Ha ocurrido un error al buscar la disponibilidad del profesional: ${error.message || 'Error desconocido'}`,
                    field: 'professional'
                }],
                'Ha ocurrido un error al buscar la disponibilidad del profesional'
            );
        }
    }

    private formatDateToSpanish(date: Date): string {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];

        return `${dayName} ${day} de ${month}`;
    }

    async findAvailableSlots(professionalId: number, serviceId: number, date: Date | string): Promise<{ mañana: string[]; tarde: string[]; noche: string[]; mensaje?: string }> {
        try {
            const professional = await this.findOne(professionalId);
            if (!professional) {
                throw new NotFoundException(
                    [
                        {
                            code: 'PROFESIONAL_NO_ENCONTRADO',
                            message: `No se encontró el profesional con ID: ${professionalId}`,
                            field: 'Id',
                        },
                    ],
                    `No se encontró el profesional con ID: ${professionalId}`,
                );
            }

            const profService = await this.professionalServiceRepository.findOne({
                where: { ProfessionalId: professionalId, ServiceId: serviceId },
            });
            if (!profService) {
                throw new NotFoundException(
                    [
                        {
                            code: 'SERVICIO_NO_DISPONIBLE',
                            message: `El profesional con ID ${professionalId} no ofrece el servicio con ID ${serviceId}`,
                            field: 'ServiceId',
                        },
                    ],
                    'El profesional no ofrece el servicio solicitado',
                );
            }

            const reqDate = typeof date === 'string' ? parseISO(date) : date;
            const baseDate = set(reqDate, {
                hours: 12,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
            });

            const dow = getDay(baseDate) === 0 ? 7 : getDay(baseDate);
            const bizHour = await this.professionalBussinessHourRepository.findOne({
                where: { ProfessionalId: professionalId, IDayOfWeek: dow },
            });
            if (!bizHour) {
                return {
                    mañana: [],
                    tarde: [],
                    noche: [],
                    mensaje: 'El profesional no trabaja en este día',
                };
            }

            const startTime = this.parseTime(baseDate, bizHour.TStartTime);
            const endTime = this.parseTime(baseDate, bizHour.TEndTime);
            const breakStart = bizHour.TBreakStartTime
                ? this.parseTime(baseDate, bizHour.TBreakStartTime)
                : null;
            const breakEnd = bizHour.TBreakEndTime
                ? this.parseTime(baseDate, bizHour.TBreakEndTime)
                : null;

            const service = await this.dataSource
                .getRepository('Service')
                .findOne({
                    where: { Id: serviceId },
                    relations: ['ServiceStages', 'Company'],
                });
            if (!service || !service.ServiceStages.length) {
                throw new NotFoundException(
                    [
                        {
                            code: 'SERVICIO_NO_ENCONTRADO',
                            message: `No se encontró el servicio con ID: ${serviceId} o no tiene etapas`,
                            field: 'ServiceId',
                        },
                    ],
                    'No se encontró el servicio',
                );
            }
            if (!service.Company) {
                throw new NotFoundException(
                    [
                        {
                            code: 'COMPANIA_NO_ENCONTRADA',
                            message: `No se encontró la compañía asociada al servicio ${serviceId}`,
                            field: 'CompanyId',
                        },
                    ],
                    'No se encontró la compañía',
                );
            }

            const totalDuration = service.ServiceStages.reduce(
                (sum, st) => sum + st.IDurationMinutes,
                0,
            );
            const slotFreq = service.Company.IFrequencyScheduling || 30;

            const existing = await this.dataSource
                .getRepository('Appointment')
                .find({
                    where: {
                        ProfessionalId: professionalId,
                        DtDate: Between(startOfDay(reqDate), endOfDay(reqDate)),
                        CurrentStateId: Not(3),
                    },
                });

            const slots: Date[] = [];
            let cursor = startTime;
            while (isBefore(cursor, endTime)) {
                const slotEnd = addMinutes(cursor, slotFreq);
                const serviceEnd = addMinutes(cursor, totalDuration);

                const inBreak = breakStart && breakEnd &&
                    cursor >= breakStart && cursor < breakEnd;

                const clash = existing.some(appt => {
                    const aStart = this.parseTime(baseDate, appt.TStartTime);
                    const aEnd = this.parseTime(baseDate, appt.TEndTime);
                    return areIntervalsOverlapping(
                        { start: cursor, end: serviceEnd },
                        { start: aStart, end: aEnd },
                    );
                });

                if (
                    isBefore(serviceEnd, endTime) &&
                    !inBreak &&
                    !clash
                ) {
                    slots.push(cursor);
                }

                cursor = slotEnd;
            }

            const mañana = slots
                .filter(d => d.getHours() < 12)
                .map(d => this.formatTime(d));
            const tarde = slots
                .filter(d => d.getHours() >= 12 && d.getHours() < 18)
                .map(d => this.formatTime(d));
            const noche = slots
                .filter(d => d.getHours() >= 18 || d.getHours() < 6)
                .map(d => this.formatTime(d));

            return { mañana, tarde, noche };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException(
                [
                    {
                        code: 'ERROR_BUSQUEDA_SLOTS',
                        message: `Error al buscar espacios disponibles: ${error.message}`,
                        field: 'professional',
                    },
                ],
                'Ha ocurrido un error al buscar los espacios disponibles',
            );
        }
    }

    private parseTime(base: Date, time: string | Date): Date {
        const ts = time instanceof Date
            ? time.toTimeString().slice(0, 5)
            : String(time).slice(0, 5);
        const [h, m] = ts.split(':').map(Number);
        return set(base, { hours: h, minutes: m, seconds: 0, milliseconds: 0 });
    }

    private formatTime(date: Date): string {
        const h = date.getHours();
        const m = date.getMinutes().toString().padStart(2, '0');
        const h12 = h % 12 || 12;
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${h12}:${m} ${ampm}`;
    }

    async findByServiceIdForLLM(serviceId: number, startDate?: Date): Promise<{ Id: number; VcName: string; VcProfession: string; VcSpecialization: string; Disponibilidad: any[] }[]> {
        try {
            const professionals = await this.findByServiceId(serviceId);
            const result = [];

            for (const professional of professionals) {
                const fullName = `${professional.VcFirstName}${professional.VcSecondName ? ' ' + professional.VcSecondName : ''} ${professional.VcFirstLastName}${professional.VcSecondLastName ? ' ' + professional.VcSecondLastName : ''}`;
                const generalAvailability = await this.findGeneralAvailability(professional.Id, startDate);

                const availability = [];

                for (const dayAvailability of generalAvailability) {
                    if (availability.length >= 5) break;
                    const dia = dayAvailability.fecha;
                    const fechaCompleta = dayAvailability.fechaCompleta;
                    const slots = await this.findAvailableSlots(professional.Id, serviceId, fechaCompleta);
                    const allHours = [
                        ...(slots.mañana || []),
                        ...(slots.tarde || []),
                        ...(slots.noche || [])
                    ];

                    if (allHours.length > 0) {
                        availability.push({
                            dia: dia,
                            date: fechaCompleta,
                            horas: allHours
                        });
                    }
                }

                result.push({
                    Id: professional.Id,
                    VcName: fullName,
                    VcProfession: professional.VcProfession,
                    VcSpecialization: professional.VcSpecialization || '',
                    Disponibilidad: availability
                });
            }

            return result;
        } catch (error) {
            console.error('Error en findByServiceIdForLLM:', error);
            console.error('Error stack:', error.stack);

            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Error obteniendo profesionales con disponibilidad para LLM: ${error.message}`);
        }
    }

    async findByCompanyIdForLLM(companyId: number, startDate?: Date): Promise<{ Id: number; VcName: string; VcProfession: string; VcSpecialization: string; Service: string[]; ServiceId: number[]; Disponibilidad: any[] }[]> {
        try {
            // Buscar profesionales que trabajan para una compañía específica
            const professionals = await this.professionalTypeOrmRepo
                .createQueryBuilder('professional')
                .innerJoinAndSelect('professional.Services', 'professionalService')
                .innerJoinAndSelect('professionalService.Service', 'service')
                .where('service.CompanyId = :companyId', { companyId })
                .getMany();

            if (!professionals || professionals.length === 0) {
                throw new NotFoundException([
                    {
                        code: 'NO_PROFESSIONALS_FOUND',
                        message: `No se encontraron profesionales para la compañía ID ${companyId}`,
                        field: 'companyId'
                    }
                ], 'No se encontraron profesionales para esta compañía');
            }

            const result = [];

            for (const professional of professionals) {
                const fullName = `${professional.VcFirstName}${professional.VcSecondName ? ' ' + professional.VcSecondName : ''} ${professional.VcFirstLastName}${professional.VcSecondLastName ? ' ' + professional.VcSecondLastName : ''}`;

                // Obtener servicios del profesional para esta compañía
                const services = professional.Services
                    .filter(ps => ps.Service.CompanyId === companyId)
                    .map(ps => ps.Service);

                const serviceNames = services.map(service => service.VcName);
                const serviceIds = services.map(service => service.Id);

                const generalAvailability = await this.findGeneralAvailability(professional.Id, startDate);

                const availability = [];

                for (const dayAvailability of generalAvailability) {
                    if (availability.length >= 5) break;
                    const dia = dayAvailability.fecha;
                    const fechaCompleta = dayAvailability.fechaCompleta;

                    // Para obtener disponibilidad general, usamos el primer servicio como referencia
                    let allHours = [];
                    if (services.length > 0) {
                        const slots = await this.findAvailableSlots(professional.Id, services[0].Id, fechaCompleta);
                        allHours = [
                            ...(slots.mañana || []),
                            ...(slots.tarde || []),
                            ...(slots.noche || [])
                        ];
                    }

                    if (allHours.length > 0) {
                        availability.push({
                            dia: dia,
                            date: fechaCompleta,
                            horas: allHours
                        });
                    }
                }

                result.push({
                    Id: professional.Id,
                    VcName: fullName,
                    VcProfession: professional.VcProfession,
                    VcSpecialization: professional.VcSpecialization || '',
                    Service: serviceNames,
                    ServiceId: serviceIds,
                    Disponibilidad: availability
                });
            }

            return result;
        } catch (error) {
            console.error('Error en findByCompanyIdForLLM:', error);
            console.error('Error stack:', error.stack);

            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Error obteniendo profesionales con disponibilidad para LLM por compañía: ${error.message}`);
        }
    }

    async findByCompanyIdForAgent(companyId: number): Promise<any[]> {
        try {
            const professionals = await this.professionalTypeOrmRepo.find({
                where: { CompanyId: companyId },
                relations: [
                    'Services',
                    'Services.Service',
                    'BussinessHours'
                ]
            });

            if (!professionals || professionals.length === 0) {
                throw new NotFoundException([
                    {
                        code: 'PROFESIONALES_NO_ENCONTRADOS',
                        message: `No se encontraron profesionales para la compañía con ID: ${companyId}`,
                        field: 'CompanyId'
                    }
                ], `No se encontraron profesionales para la compañía con ID: ${companyId}`);
            }

            const diasSemana = {
                1: 'Lunes',
                2: 'Martes',
                3: 'Miércoles',
                4: 'Jueves',
                5: 'Viernes',
                6: 'Sábado',
                7: 'Domingo'
            };

            return professionals.map(professional => {
                const fullName = `${professional.VcFirstName}${professional.VcSecondName ? ' ' + professional.VcSecondName : ''} ${professional.VcFirstLastName}${professional.VcSecondLastName ? ' ' + professional.VcSecondLastName : ''}`.trim();

                // ✅ NUEVA ESTRUCTURA: Combinar nombre y ID del servicio
                const servicios = professional.Services
                    ?.map(ps => ({
                        service_id: ps.ServiceId,
                        service: ps.Service?.VcName || 'Servicio sin nombre'
                    }))
                    .filter(s => s.service_id && s.service) || [];

                // Formatear horarios
                const horarios = professional.BussinessHours
                    ?.sort((a, b) => a.IDayOfWeek - b.IDayOfWeek)
                    .map(bh => {
                        const formatTime = (time: Date | string) => {
                            if (!time) return '';
                            const timeStr = time instanceof Date
                                ? time.toTimeString().slice(0, 5)
                                : String(time).slice(0, 5);
                            return timeStr;
                        };

                        const horario: any = {
                            dia: diasSemana[bh.IDayOfWeek] || `Día ${bh.IDayOfWeek}`,
                            horaInicio: formatTime(bh.TStartTime),
                            horaFin: formatTime(bh.TEndTime)
                        };

                        // Agregar horario de almuerzo/break si existe
                        if (bh.TBreakStartTime && bh.TBreakEndTime) {
                            horario.break = {
                                inicio: formatTime(bh.TBreakStartTime),
                                fin: formatTime(bh.TBreakEndTime)
                            };
                        }

                        return horario;
                    }) || [];

                return {
                    Id: professional.Id,
                    Nombre: fullName,
                    Profesion: professional.VcProfession,
                    Especializacion: professional.VcSpecialization || 'No especificada',
                    Servicios: servicios, // ✅ Nueva estructura
                    Horarios: horarios,
                    Email: professional.VcEmail,
                    Telefono: professional.VcPhone
                };
            });

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_BUSQUEDA_PROFESIONALES',
                    message: `Ha ocurrido un error al buscar profesionales: ${error.message || 'Error desconocido'}`,
                    field: 'CompanyId'
                }],
                'Ha ocurrido un error al buscar profesionales'
            );
        }
    }
}
