import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalEntity } from '../entities/professional.entity';
import { CreateProfessionalDto } from '../dto/professionalCreate.dto';
import { UpdateProfessionalDto } from '../dto/professionalUpdate.dto';
import { ICrudRepository } from '../../../shared/interfaces/crud.interface';

@Injectable()
export class ProfessionalRepository implements ICrudRepository<ProfessionalEntity, CreateProfessionalDto, UpdateProfessionalDto> {
    constructor(
        @InjectRepository(ProfessionalEntity)
        private readonly professionalRepository: Repository<ProfessionalEntity>
    ) {}

    async findAll(filters?: Record<string, any>): Promise<ProfessionalEntity[]> {
        return await this.professionalRepository.find(filters ? { where: filters } : undefined);
    }

    async findOne(id: number): Promise<ProfessionalEntity | null> {
        return await this.professionalRepository.findOne({ where: { Id: id } });
    }

    async create(data: CreateProfessionalDto): Promise<ProfessionalEntity> {
        const entity = this.professionalRepository.create(data as any);
        const saved = await this.professionalRepository.save(entity);
        return saved as unknown as ProfessionalEntity;
    }

    async update(id: number, data: UpdateProfessionalDto): Promise<ProfessionalEntity> {
        await this.professionalRepository.update(id, data);
        const updated = await this.findOne(id);
        if (!updated) {
            throw new NotFoundException(`Professional with ID ${id} not found`);
        }
        return updated;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.professionalRepository.delete(id);
        return result.affected > 0;
    }
    
    async remove(id: number): Promise<void> {
        const entity = await this.findOne(id);
        if (!entity) {
            throw new NotFoundException(`Professional with ID ${id} not found`);
        }
        await this.professionalRepository.remove(entity);
    }

    async findByEmail(email: string): Promise<ProfessionalEntity | null> {
        return await this.professionalRepository.findOne({ where: { VcEmail: email } });
    }

    async findByIdentificationNumber(identificationNumber: string): Promise<ProfessionalEntity | null> {
        return await this.professionalRepository.findOne({ where: { VcIdentificationNumber: identificationNumber } });
    }

    async findBySpecialization(specialization: string): Promise<ProfessionalEntity[]> {
        return await this.professionalRepository.find({ where: { VcSpecialization: specialization } });
    }

    async findByServiceId(serviceId: number): Promise<ProfessionalEntity[]> {
        return await this.professionalRepository
            .createQueryBuilder('professional')
            .innerJoin('professional.Services', 'professionalService')
            .where('professionalService.ServiceId = :serviceId', { serviceId })
            .getMany();
    }

    async findGeneralAvailability(professionalId: number): Promise<any[]> {
        const bussinessHours = await this.professionalRepository
            .createQueryBuilder('professional')
            .innerJoinAndSelect('professional.BussinessHours', 'bussinessHour')
            .where('professional.Id = :professionalId', { professionalId })
            .orderBy('bussinessHour.IDayOfWeek', 'ASC')
            .addOrderBy('bussinessHour.TStartTime', 'ASC')
            .getOne();
        
        if (!bussinessHours || !bussinessHours.BussinessHours || bussinessHours.BussinessHours.length === 0) {
            return [];
        }

        const dayNames = [
            'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
        ];

        return bussinessHours.BussinessHours.map(hour => {
            const formatTime = (time: any): string => {
                if (!time) return null;
                
                if (typeof time === 'string') {
                    const parts = time.split(':');
                    if (parts.length >= 2) {
                        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
                    }
                }
                
                if (time instanceof Date) {
                    try {
                        const hours = time.getHours().toString().padStart(2, '0');
                        const minutes = time.getMinutes().toString().padStart(2, '0');
                        return `${hours}:${minutes}`;
                    } catch (e) {
                        return null;
                    }
                }
                
                try {
                    const timeStr = String(time);
                    const matches = timeStr.match(/(\d{1,2}):(\d{2})/);
                    if (matches && matches.length >= 3) {
                        return `${matches[1].padStart(2, '0')}:${matches[2].padStart(2, '0')}`;
                    }
                } catch (e) {}
                
                return null;
            };

            return {
                dia: dayNames[hour.IDayOfWeek],
                diaNumero: hour.IDayOfWeek,
                horaInicio: formatTime(hour.TStartTime),
                horaFin: formatTime(hour.TEndTime),
                descansoInicio: formatTime(hour.TBreakStartTime),
                descansoFin: formatTime(hour.TBreakEndTime),
                notas: hour.VcNotes || null,
                salaId: hour.CompanyBranchRoomId
            };
        });
    }

    async findAvailableSlots(professionalId: number, serviceId: number, date: Date): Promise<any[]> {
        const professional = await this.professionalRepository
            .createQueryBuilder('professional')
            .innerJoinAndSelect('professional.BussinessHours', 'businessHour')
            .innerJoinAndSelect('professional.Services', 'professionalService')
            .innerJoinAndSelect('professionalService.Service', 'service')
            .where('professional.Id = :professionalId', { professionalId })
            .andWhere('professionalService.ServiceId = :serviceId', { serviceId })
            .getOne();

        if (!professional || !professional.BussinessHours || professional.BussinessHours.length === 0) {
            return [];
        }

        const serviceOffered = professional.Services.find(s => s.ServiceId === serviceId);
        if (!serviceOffered) {
            return [];
        }

        const service = serviceOffered.Service;
        if (!service || !service.VcTime) {
            return [];
        }

        const serviceDuration = this.convertTimeToMinutes(service.VcTime);
        if (serviceDuration <= 0) {
            return [];
        }

        const dayOfWeek = date.getDay();

        const daySchedules = professional.BussinessHours.filter(hour => hour.IDayOfWeek === dayOfWeek);
        if (daySchedules.length === 0) {
            return [];
        }

        const appointments = await this.professionalRepository
            .createQueryBuilder('professional')
            .innerJoinAndSelect(
                'professional.Appointments',
                'appointment',
                'appointment.ProfessionalId = professional.Id'
            )
            .where('professional.Id = :professionalId', { professionalId })
            .andWhere('DATE(appointment.DtDate) = DATE(:date)', { 
                date: date.toISOString().split('T')[0]
            })
            .getOne();

        const existingAppointments = appointments?.Appointments || [];
        existingAppointments.sort((a, b) => {
            const aStart = this.convertTimeStringToMinutes(a.TStartTime);
            const bStart = this.convertTimeStringToMinutes(b.TStartTime);
            return aStart - bStart;
        });

        const availableSlots = [];

        for (const schedule of daySchedules) {
            const startTime = this.convertTimeToMinutes(schedule.TStartTime);
            const endTime = this.convertTimeToMinutes(schedule.TEndTime);
            
            const breakStartTime = schedule.TBreakStartTime ? 
                this.convertTimeToMinutes(schedule.TBreakStartTime) : null;
            const breakEndTime = schedule.TBreakEndTime ? 
                this.convertTimeToMinutes(schedule.TBreakEndTime) : null;

            const timeSlots = this.generateTimeSlots(
                startTime, 
                endTime, 
                serviceDuration, 
                existingAppointments,
                breakStartTime,
                breakEndTime
            );

            for (const slot of timeSlots) {
                const slotDate = new Date(date);
                slotDate.setHours(Math.floor(slot / 60), slot % 60, 0, 0);
                
                const endSlotDate = new Date(slotDate);
                endSlotDate.setMinutes(endSlotDate.getMinutes() + serviceDuration);

                availableSlots.push({
                    fecha: slotDate.toISOString().split('T')[0],
                    horaInicio: this.formatMinutesToTime(slot),
                    horaFin: this.formatMinutesToTime(slot + serviceDuration),
                    fechaInicioCompleta: slotDate.toISOString(),
                    fechaFinCompleta: endSlotDate.toISOString(),
                    duracionMinutos: serviceDuration,
                    salaId: schedule.CompanyBranchRoomId
                });
            }
        }

        availableSlots.sort((a, b) => {
            return this.convertTimeStringToMinutes(a.horaInicio) - 
                   this.convertTimeStringToMinutes(b.horaInicio);
        });

        return availableSlots;
    }

    private convertTimeStringToMinutes(timeString: string): number {
        if (!timeString) return 0;
        
        const parts = timeString.split(':');
        if (parts.length < 2) return 0;
        
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        
        if (isNaN(hours) || isNaN(minutes)) return 0;
        
        return hours * 60 + minutes;
    }

    private convertTimeToMinutes(time: any): number {
        if (!time) return 0;
        
        if (typeof time === 'string') {
            return this.convertTimeStringToMinutes(time);
        }
        
        if (time instanceof Date) {
            try {
                return time.getHours() * 60 + time.getMinutes();
            } catch (e) {
                return 0;
            }
        }
        
        try {
            const timeStr = String(time);
            const matches = timeStr.match(/(\d{1,2}):(\d{2})/);
            if (matches && matches.length >= 3) {
                const hours = parseInt(matches[1], 10);
                const minutes = parseInt(matches[2], 10);
                return hours * 60 + minutes;
            }
        } catch (e) {}
        
        return 0;
    }

    private formatMinutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    private generateTimeSlots(
        startTime: number, 
        endTime: number, 
        serviceDuration: number, 
        appointments: any[],
        breakStartTime: number | null,
        breakEndTime: number | null
    ): number[] {
        const slots = [];
        const interval = 15;

        const occupiedRanges = appointments.map(appointment => {
            const apptStart = this.convertTimeStringToMinutes(appointment.TStartTime);
            const apptEnd = this.convertTimeStringToMinutes(appointment.TEndTime);
            return { start: apptStart, end: apptEnd };
        });

        for (let time = startTime; time <= endTime - serviceDuration; time += interval) {
            const proposedEnd = time + serviceDuration;
            let isSlotAvailable = true;

            if (breakStartTime !== null && breakEndTime !== null) {
                if (time < breakEndTime && proposedEnd > breakStartTime) {
                    isSlotAvailable = false;
                }
            }

            for (const range of occupiedRanges) {
                if (time < range.end && proposedEnd > range.start) {
                    isSlotAvailable = false;
                    break;
                }
            }

            if (isSlotAvailable) {
                slots.push(time);
            }
        }

        return slots;
    }
}
