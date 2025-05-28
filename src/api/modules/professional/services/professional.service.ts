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
        const existingEmail = await this.professionalTypeOrmRepo.findOne({
            where: { VcEmail: createProfessionalDto.VcEmail }
        });

        if (existingEmail) {
            errors.push({
                code: 'EMAIL_YA_EXISTE',
                message: 'Ya existe un profesional con este correo electrónico.',
                field: 'VcEmail'
            });
        }

        const existingId = await this.professionalTypeOrmRepo.findOne({
            where: { VcIdentificationNumber: createProfessionalDto.VcIdentificationNumber }
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

        if (updateProfessionalDto.VcEmail && updateProfessionalDto.VcEmail !== professional.VcEmail) {
            const existingEmail = await this.professionalTypeOrmRepo.findOne({
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
            const existingId = await this.professionalTypeOrmRepo.findOne({
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

    async findAvailableSlots(professionalId: number, serviceId: number, date: Date): Promise<any> {
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

            const professionalService = await this.professionalServiceRepository.findOne({
                where: {
                    ProfessionalId: professionalId,
                    ServiceId: serviceId
                }
            });

            if (!professionalService) {
                throw new NotFoundException([
                    {
                        code: 'SERVICIO_NO_DISPONIBLE',
                        message: `El profesional con ID ${professionalId} no ofrece el servicio con ID ${serviceId}`,
                        field: 'ServiceId'
                    }
                ], `El profesional no ofrece el servicio solicitado`);
            }

            let requestedDate;

            if (date instanceof Date) {
                const isoString = date.toISOString();
                const [year, month, day] = isoString.split('T')[0].split('-').map(Number);
                requestedDate = new Date(year, month - 1, day, 12, 0, 0);
            } else {
                const [year, month, day] = (date as string).split('-').map(Number);
                requestedDate = new Date(year, month - 1, day, 12, 0, 0);
            }

            let dayOfWeek = requestedDate.getDay();
            dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

            const businessHour = await this.professionalBussinessHourRepository.findOne({
                where: {
                    ProfessionalId: professionalId,
                    IDayOfWeek: dayOfWeek
                }
            });

            if (!businessHour) {
                return {
                    mañana: [],
                    tarde: [],
                    noche: [],
                    mensaje: "El profesional no trabaja en este día"
                };
            }

            const startTimeStr = businessHour.TStartTime instanceof Date
                ? businessHour.TStartTime.toTimeString().substring(0, 5)
                : String(businessHour.TStartTime).substring(0, 5);

            const endTimeStr = businessHour.TEndTime instanceof Date
                ? businessHour.TEndTime.toTimeString().substring(0, 5)
                : String(businessHour.TEndTime).substring(0, 5);

            const [startHour, startMinute] = startTimeStr.split(':').map(Number);
            const [endHour, endMinute] = endTimeStr.split(':').map(Number);

            const startDate = new Date(requestedDate);
            startDate.setHours(startHour, startMinute, 0, 0);

            const endDate = new Date(requestedDate);
            endDate.setHours(endHour, endMinute, 0, 0);

            let breakStartDate = null;
            let breakEndDate = null;

            if (businessHour.TBreakStartTime && businessHour.TBreakEndTime) {
                const breakStartStr = businessHour.TBreakStartTime instanceof Date
                    ? businessHour.TBreakStartTime.toTimeString().substring(0, 5)
                    : String(businessHour.TBreakStartTime).substring(0, 5);

                const breakEndStr = businessHour.TBreakEndTime instanceof Date
                    ? businessHour.TBreakEndTime.toTimeString().substring(0, 5)
                    : String(businessHour.TBreakEndTime).substring(0, 5);

                const [breakStartHour, breakStartMinute] = breakStartStr.split(':').map(Number);
                const [breakEndHour, breakEndMinute] = breakEndStr.split(':').map(Number);

                breakStartDate = new Date(requestedDate);
                breakStartDate.setHours(breakStartHour, breakStartMinute, 0, 0);

                breakEndDate = new Date(requestedDate);
                breakEndDate.setHours(breakEndHour, breakEndMinute, 0, 0);
            }

            const serviceEntity = await this.dataSource.getRepository('Service').findOne({
                where: { Id: serviceId },
                relations: ['ServiceStages']
            });

            if (!serviceEntity || !serviceEntity.ServiceStages) {
                throw new NotFoundException([
                    {
                        code: 'SERVICIO_NO_ENCONTRADO',
                        message: `No se encontró el servicio con ID: ${serviceId} o no tiene etapas definidas`,
                        field: 'ServiceId'
                    }
                ], `No se encontró el servicio`);
            }

            const totalServiceDuration = serviceEntity.ServiceStages.reduce(
                (total, stage) => total + stage.IDurationMinutes, 0
            );

            const startOfDay = new Date(requestedDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(requestedDate);
            endOfDay.setHours(23, 59, 59, 999);

            const existingAppointments = await this.dataSource.getRepository('Appointment').find({
                where: {
                    ProfessionalId: professionalId,
                    DtDate: Between(startOfDay, endOfDay),
                    CurrentStateId: Not(3)
                },
                order: { TStartTime: 'ASC' }
            });

            const company = await this.dataSource.getRepository('Company').findOne({
                where: { Id: serviceEntity.CompanyId }
            });

            if (!company) {
                throw new NotFoundException([
                    {
                        code: 'COMPANIA_NO_ENCONTRADA',
                        message: `No se encontró la compañía asociada al servicio con ID: ${serviceId}`,
                        field: 'CompanyId'
                    }
                ], `No se encontró la compañía`);
            }

            const availableTimeSlots = [];
            const slotDuration = company.IFrequencyScheduling || 10;

            let currentTime = new Date(startDate);

            while (currentTime < endDate) {
                const slotStartTime = new Date(currentTime);
                const slotEndTime = new Date(currentTime);
                slotEndTime.setMinutes(slotEndTime.getMinutes() + slotDuration);

                const serviceEndTime = new Date(slotStartTime);
                serviceEndTime.setMinutes(serviceEndTime.getMinutes() + totalServiceDuration);

                let isInBreakTime = false;
                if (breakStartDate && breakEndDate) {
                    isInBreakTime = slotStartTime >= breakStartDate && slotStartTime < breakEndDate;
                }

                let overlapsWithAppointment = false;
                for (const appointment of existingAppointments) {
                    const appointmentStartTime = new Date(requestedDate);
                    const [appHour, appMinute] = appointment.TStartTime.split(':').map(Number);
                    appointmentStartTime.setHours(appHour, appMinute, 0, 0);

                    const appointmentEndTime = new Date(requestedDate);
                    const [appEndHour, appEndMinute] = appointment.TEndTime.split(':').map(Number);
                    appointmentEndTime.setHours(appEndHour, appEndMinute, 0, 0);

                    if (
                        (slotStartTime >= appointmentStartTime && slotStartTime < appointmentEndTime) ||
                        (serviceEndTime > appointmentStartTime && serviceEndTime <= appointmentEndTime) ||
                        (slotStartTime <= appointmentStartTime && serviceEndTime >= appointmentEndTime)
                    ) {
                        overlapsWithAppointment = true;
                        break;
                    }
                }

                if (
                    serviceEndTime <= endDate &&
                    !isInBreakTime &&
                    !overlapsWithAppointment
                ) {
                    const timeSlot = {
                        time: this.formatTime(slotStartTime),
                        startTime: slotStartTime,
                        hour: slotStartTime.getHours()
                    };
                    availableTimeSlots.push(timeSlot);
                }

                currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
            }

            const morningSlots = availableTimeSlots
                .filter(slot => slot.hour >= 6 && slot.hour < 12)
                .map(slot => slot.time);

            const afternoonSlots = availableTimeSlots
                .filter(slot => slot.hour >= 12 && slot.hour < 18)
                .map(slot => slot.time);

            const eveningSlots = availableTimeSlots
                .filter(slot => (slot.hour >= 18 && slot.hour <= 23) || (slot.hour >= 0 && slot.hour < 6))
                .map(slot => slot.time);

            return {
                mañana: morningSlots,
                tarde: afternoonSlots,
                noche: eveningSlots
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException(
                [{
                    code: 'ERROR_BUSQUEDA_SLOTS',
                    message: `Ha ocurrido un error al buscar los espacios disponibles: ${error.message || 'Error desconocido'}`,
                    field: 'professional'
                }],
                'Ha ocurrido un error al buscar los espacios disponibles'
            );
        }
    }

    private formatTime(date: Date): string {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${hours}:${minutes} ${ampm}`;
    }
}
