import { DataSource } from 'typeorm';
import { AppointmentEntity } from '../../modules/appointment/entities/appointment.entity';
import { AppointmentStateEntity } from '../../modules/appointment/entities/appointmentState.entity';
import { AppointmentStageEntity } from '../../modules/appointment/entities/appointmentStage.entity';


export const appointmentSeed = async (dataSource: DataSource): Promise<void> => {
    const appointmentRepository = dataSource.getRepository(AppointmentEntity);
    const appointmentStateRepository = dataSource.getRepository(AppointmentStateEntity);
    const appointmentStageRepository = dataSource.getRepository(AppointmentStageEntity);
    
    const existingAppointments = await appointmentRepository.find();
    if (existingAppointments.length > 0) {
        return;
    }

    
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    
    const dayAfterTomorrow = new Date(currentDate);
    dayAfterTomorrow.setDate(currentDate.getDate() + 2);
    
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);

    
    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    
    const appointments = [
        {
            Id: 1,
            ClientId: 1,
            ServiceId: 1, 
            ProfessionalId: 1, 
            DtDate: formatDate(tomorrow), 
            TTime: "09:00",
            BIsCompleted: false,
            BIsAbsent: false,
            CurrentStateId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            Id: 2,
            ClientId: 2,
            ServiceId: 1, 
            ProfessionalId: 2,
            DtDate: formatDate(tomorrow),
            TTime: "14:00",
            BIsCompleted: false,
            BIsAbsent: false,
            CurrentStateId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            Id: 3,
            ClientId: 1,
            ServiceId: 1, 
            ProfessionalId: 1, 
            DtDate: formatDate(nextWeek), 
            TTime: "15:00",
            BIsCompleted: false,
            BIsAbsent: false,
            CurrentStateId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    
    await appointmentRepository.insert(appointments);
    
    const appointmentStates = [
        {
            AppointmentId: 1,
            StateId: 1, 
            VcChangedBy: "1",
            VcReason: "Creación inicial de cita",
            DtDateTime: new Date().toISOString(), 
            DtPreviousDate: formatDate(tomorrow),
            TPreviousTime: "09:00",
            DtCurrentDate: formatDate(tomorrow),
            TCurrentTime: "09:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 2,
            StateId: 1, 
            VcChangedBy: "1", 
            VcReason: "Creación inicial de cita",
            DtDateTime: new Date().toISOString(), 
            DtPreviousDate: formatDate(tomorrow),
            TPreviousTime: "14:00",
            DtCurrentDate: formatDate(tomorrow),
            TCurrentTime: "14:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 3,
            StateId: 1, 
            VcChangedBy: "1", 
            VcReason: "Creación inicial de cita",
            DtDateTime: new Date().toISOString(), 
            DtPreviousDate: formatDate(nextWeek),
            TPreviousTime: "15:00",
            DtCurrentDate: formatDate(nextWeek),
            TCurrentTime: "15:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    
    await appointmentStateRepository.insert(appointmentStates);
    
    const calculateDateTime = (date: string, time: string, addMinutes = 0): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const dateTime = new Date(date);
        dateTime.setHours(hours, minutes, 0, 0);
        dateTime.setMinutes(dateTime.getMinutes() + addMinutes);
        return dateTime.toISOString();
    };
    
    const appointmentStages = [
        {
            AppointmentId: 1,
            ServiceStageId: 1, 
            StartDateTime: calculateDateTime(formatDate(tomorrow), "09:00", 0),
            EndDateTime: calculateDateTime(formatDate(tomorrow), "09:00", 15),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 1,
            ServiceStageId: 2, 
            StartDateTime: calculateDateTime(formatDate(tomorrow), "09:00", 15),
            EndDateTime: calculateDateTime(formatDate(tomorrow), "09:00", 35),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 1,
            ServiceStageId: 3, 
            StartDateTime: calculateDateTime(formatDate(tomorrow), "09:00", 35),
            EndDateTime: calculateDateTime(formatDate(tomorrow), "09:00", 50),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 1,
            ServiceStageId: 4,
            StartDateTime: calculateDateTime(formatDate(tomorrow), "09:00", 50),
            EndDateTime: calculateDateTime(formatDate(tomorrow), "09:00", 80),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 1,
            ServiceStageId: 5,
            StartDateTime: calculateDateTime(formatDate(tomorrow), "09:00", 80),
            EndDateTime: calculateDateTime(formatDate(tomorrow), "09:00", 90),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    
    await appointmentStageRepository.insert(appointmentStages);
};