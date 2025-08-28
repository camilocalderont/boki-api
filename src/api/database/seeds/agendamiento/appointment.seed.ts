import { DataSource } from 'typeorm';
import { AppointmentEntity } from '../../../modules/appointment/entities/appointment.entity';
import { AppointmentStateEntity } from '../../../modules/appointment/entities/appointmentState.entity';
import { AppointmentStageEntity } from '../../../modules/appointment/entities/appointmentStage.entity';

export const appointmentSeed = async (dataSource: DataSource): Promise<void> => {
    const appointmentRepository = dataSource.getRepository(AppointmentEntity);
    const appointmentStateRepository = dataSource.getRepository(AppointmentStateEntity);
    const appointmentStageRepository = dataSource.getRepository(AppointmentStageEntity);

    const existingAppointments = await appointmentRepository.find();
    if (existingAppointments.length > 0) {
        return;
    }

    // Fechas para las citas
    const currentDate = new Date();

    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);

    const dayAfterTomorrow = new Date(currentDate);
    dayAfterTomorrow.setDate(currentDate.getDate() + 2);

    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);

    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);

    // Obtener el día de la semana actual para ajustar las fechas a días válidos para los profesionales
    const currentDayOfWeek = currentDate.getDay(); // 0 = Domingo, 1 = Lunes, etc.

    // Asegurar que la fecha de mañana caiga en un día donde el profesional 1 trabaje (Lunes, Miércoles o Viernes)
    // Profesional 1: Lunes (1), Miércoles (3), Viernes (5)
    let nextDateProf1 = new Date(currentDate);
    nextDateProf1.setDate(currentDate.getDate() + 1);
    while (![1, 3, 5].includes(nextDateProf1.getDay())) {
        nextDateProf1.setDate(nextDateProf1.getDate() + 1);
    }

    // Profesional 2: Martes (2), Jueves (4), Sábado (6)
    let nextDateProf2 = new Date(currentDate);
    nextDateProf2.setDate(currentDate.getDate() + 1);
    while (![2, 4, 6].includes(nextDateProf2.getDay())) {
        nextDateProf2.setDate(nextDateProf2.getDate() + 1);
    }

    // Profesional 3: Lunes a Viernes (1-5)
    let nextDateProf3 = new Date(currentDate);
    nextDateProf3.setDate(currentDate.getDate() + 1);
    while (![1, 2, 3, 4, 5].includes(nextDateProf3.getDay())) {
        nextDateProf3.setDate(nextDateProf3.getDate() + 1);
    }

    // Formato de fecha para base de datos
    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    // Citas para insertar
    const appointments = [
        // Cita 1: Profesional 1, Cliente 1, Creada (Estado 1)
        {
            Id: 1,
            ClientId: 1,
            ServiceId: 1,
            ProfessionalId: 1,
            DtDate: formatDate(nextDateProf1),
            TTime: "09:00",
            TEndTime: "10:30", // Duración 90 minutos
            BIsCompleted: false,
            BIsAbsent: false,
            CurrentStateId: 1, // Creada
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Cita 2: Profesional 2, Cliente 2, Confirmada (Estado 2)
        {
            Id: 2,
            ClientId: 2,
            ServiceId: 1,
            ProfessionalId: 2,
            DtDate: formatDate(nextDateProf2),
            TTime: "14:00",
            TEndTime: "15:30", // Duración 90 minutos
            BIsCompleted: false,
            BIsAbsent: false,
            CurrentStateId: 2, // Confirmada
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Cita 3: Profesional 1, Cliente 1, Reprogramada (Estado 4)
        {
            Id: 3,
            ClientId: 1,
            ServiceId: 2,
            ProfessionalId: 1,
            DtDate: formatDate(nextWeek),
            TTime: "15:00",
            TEndTime: "16:30", // Duración 90 minutos
            BIsCompleted: false,
            BIsAbsent: false,
            CurrentStateId: 4, // Reprogramada
            created_at: new Date(Date.now() - 86400000).toISOString(), // Creada hace 1 día
            updated_at: new Date().toISOString()
        },
        // Cita 4: Profesional 3, Cliente 3, Cancelada (Estado 3)
        {
            Id: 4,
            ClientId: 3,
            ServiceId: 3,
            ProfessionalId: 3,
            DtDate: formatDate(nextDateProf3),
            TTime: "10:00",
            TEndTime: "11:30", // Duración 90 minutos
            BIsCompleted: false,
            BIsAbsent: false,
            CurrentStateId: 3, // Cancelada
            created_at: new Date(Date.now() - 172800000).toISOString(), // Creada hace 2 días
            updated_at: new Date().toISOString()
        },
        // Cita 5: Profesional 3, Cliente 2, Creada (Estado 1) para una segunda cita en el mismo día
        {
            Id: 5,
            ClientId: 2,
            ServiceId: 4,
            ProfessionalId: 3,
            DtDate: formatDate(nextDateProf3),
            TTime: "14:00",
            TEndTime: "15:30", // Duración 90 minutos
            BIsCompleted: false,
            BIsAbsent: false,
            CurrentStateId: 1, // Creada
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Cita 6: Profesional 2, Cliente 3, Confirmada (Estado 2) para más tarde esa semana
        {
            Id: 6,
            ClientId: 3,
            ServiceId: 2,
            ProfessionalId: 2,
            DtDate: formatDate(dayAfterTomorrow),
            TTime: "10:00",
            TEndTime: "11:30", // Duración 90 minutos
            BIsCompleted: false,
            BIsAbsent: false,
            CurrentStateId: 2, // Confirmada
            created_at: new Date(Date.now() - 259200000).toISOString(), // Creada hace 3 días
            updated_at: new Date().toISOString()
        },
        // Cita 7: Profesional 1, Cliente 2, Creada (Estado 1) para el próximo mes
        {
            Id: 7,
            ClientId: 2,
            ServiceId: 1,
            ProfessionalId: 1,
            DtDate: formatDate(nextMonth),
            TTime: "10:00",
            TEndTime: "11:30", // Duración 90 minutos
            BIsCompleted: false,
            BIsAbsent: false,
            CurrentStateId: 1, // Creada
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

    await appointmentRepository.insert(appointments);

    // Estados de citas para cada cita creada
    const appointmentStates = [
        // Cita 1: Creada inicialmente
        {
            AppointmentId: 1,
            StateId: 1, // Creada
            VcChangedBy: "1", // ID del admin/sistema
            VcReason: "Creación inicial de cita",
            DtDateTime: new Date().toISOString(),
            DtPreviousDate: formatDate(nextDateProf1),
            TPreviousTime: "09:00",
            DtCurrentDate: formatDate(nextDateProf1),
            TCurrentTime: "09:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Cita 2: Creada inicialmente
        {
            AppointmentId: 2,
            StateId: 1, // Creada
            VcChangedBy: "1",
            VcReason: "Creación inicial de cita",
            DtDateTime: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
            DtPreviousDate: formatDate(nextDateProf2),
            TPreviousTime: "14:00",
            DtCurrentDate: formatDate(nextDateProf2),
            TCurrentTime: "14:00",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        // Cita 2: Luego confirmada
        {
            AppointmentId: 2,
            StateId: 2, // Confirmada
            VcChangedBy: "1",
            VcReason: "Confirmación por parte del cliente",
            DtDateTime: new Date().toISOString(),
            DtPreviousDate: formatDate(nextDateProf2),
            TPreviousTime: "14:00",
            DtCurrentDate: formatDate(nextDateProf2),
            TCurrentTime: "14:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Cita 3: Creada inicialmente
        {
            AppointmentId: 3,
            StateId: 1, // Creada
            VcChangedBy: "1",
            VcReason: "Creación inicial de cita",
            DtDateTime: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
            DtPreviousDate: formatDate(nextDateProf1), // Fecha original
            TPreviousTime: "11:00", // Hora original
            DtCurrentDate: formatDate(nextDateProf1),
            TCurrentTime: "11:00",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString()
        },
        // Cita 3: Luego reprogramada
        {
            AppointmentId: 3,
            StateId: 4, // Reprogramada
            VcChangedBy: "1",
            VcReason: "Cliente solicitó cambio de fecha",
            DtDateTime: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
            DtPreviousDate: formatDate(nextDateProf1), // Fecha anterior
            TPreviousTime: "11:00", // Hora anterior
            DtCurrentDate: formatDate(nextWeek), // Nueva fecha
            TCurrentTime: "15:00", // Nueva hora
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        // Cita 4: Creada inicialmente
        {
            AppointmentId: 4,
            StateId: 1, // Creada
            VcChangedBy: "1",
            VcReason: "Creación inicial de cita",
            DtDateTime: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
            DtPreviousDate: formatDate(nextDateProf3),
            TPreviousTime: "10:00",
            DtCurrentDate: formatDate(nextDateProf3),
            TCurrentTime: "10:00",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString()
        },
        // Cita 4: Luego cancelada
        {
            AppointmentId: 4,
            StateId: 3, // Cancelada
            VcChangedBy: "3", // Cliente canceló
            VcReason: "Cliente no puede asistir",
            DtDateTime: new Date().toISOString(),
            DtPreviousDate: formatDate(nextDateProf3),
            TPreviousTime: "10:00",
            DtCurrentDate: formatDate(nextDateProf3),
            TCurrentTime: "10:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Cita 5: Creada inicialmente
        {
            AppointmentId: 5,
            StateId: 1, // Creada
            VcChangedBy: "1",
            VcReason: "Creación inicial de cita",
            DtDateTime: new Date().toISOString(),
            DtPreviousDate: formatDate(nextDateProf3),
            TPreviousTime: "14:00",
            DtCurrentDate: formatDate(nextDateProf3),
            TCurrentTime: "14:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Cita 6: Creada inicialmente
        {
            AppointmentId: 6,
            StateId: 1, // Creada
            VcChangedBy: "1",
            VcReason: "Creación inicial de cita",
            DtDateTime: new Date(Date.now() - 259200000).toISOString(), // 3 días atrás
            DtPreviousDate: formatDate(dayAfterTomorrow),
            TPreviousTime: "10:00",
            DtCurrentDate: formatDate(dayAfterTomorrow),
            TCurrentTime: "10:00",
            created_at: new Date(Date.now() - 259200000).toISOString(),
            updated_at: new Date(Date.now() - 259200000).toISOString()
        },
        // Cita 6: Luego confirmada
        {
            AppointmentId: 6,
            StateId: 2, // Confirmada
            VcChangedBy: "1",
            VcReason: "Confirmación por parte del profesional",
            DtDateTime: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
            DtPreviousDate: formatDate(dayAfterTomorrow),
            TPreviousTime: "10:00",
            DtCurrentDate: formatDate(dayAfterTomorrow),
            TCurrentTime: "10:00",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        // Cita 7: Creada inicialmente
        {
            AppointmentId: 7,
            StateId: 1, // Creada
            VcChangedBy: "1",
            VcReason: "Creación inicial de cita",
            DtDateTime: new Date().toISOString(),
            DtPreviousDate: formatDate(nextMonth),
            TPreviousTime: "10:00",
            DtCurrentDate: formatDate(nextMonth),
            TCurrentTime: "10:00",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

    await appointmentStateRepository.insert(appointmentStates);

    // Función para calcular fechas/horas de inicio y fin para las etapas
    const calculateDateTime = (date: string, time: string, addMinutes = 0): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const dateTime = new Date(date);
        dateTime.setHours(hours, minutes, 0, 0);
        dateTime.setMinutes(dateTime.getMinutes() + addMinutes);
        return dateTime.toISOString();
    };

    // Crear etapas para cada cita basadas en el servicio (5 etapas para el servicio 1)
    // Etapas para la cita 1 (Servicio 1, 90 min en total)
    const appointmentStages = [
        // Etapas para la cita 1
        {
            AppointmentId: 1,
            ServiceStageId: 1,
            StartDateTime: calculateDateTime(formatDate(nextDateProf1), "09:00", 0),
            EndDateTime: calculateDateTime(formatDate(nextDateProf1), "09:00", 15),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 1,
            ServiceStageId: 2,
            StartDateTime: calculateDateTime(formatDate(nextDateProf1), "09:00", 15),
            EndDateTime: calculateDateTime(formatDate(nextDateProf1), "09:00", 35),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 1,
            ServiceStageId: 3,
            StartDateTime: calculateDateTime(formatDate(nextDateProf1), "09:00", 35),
            EndDateTime: calculateDateTime(formatDate(nextDateProf1), "09:00", 50),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 1,
            ServiceStageId: 4,
            StartDateTime: calculateDateTime(formatDate(nextDateProf1), "09:00", 50),
            EndDateTime: calculateDateTime(formatDate(nextDateProf1), "09:00", 80),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 1,
            ServiceStageId: 5,
            StartDateTime: calculateDateTime(formatDate(nextDateProf1), "09:00", 80),
            EndDateTime: calculateDateTime(formatDate(nextDateProf1), "09:00", 90),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },

        // Etapas para la cita 2 (mismo servicio, diferentes horas)
        {
            AppointmentId: 2,
            ServiceStageId: 1,
            StartDateTime: calculateDateTime(formatDate(nextDateProf2), "14:00", 0),
            EndDateTime: calculateDateTime(formatDate(nextDateProf2), "14:00", 15),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 2,
            ServiceStageId: 2,
            StartDateTime: calculateDateTime(formatDate(nextDateProf2), "14:00", 15),
            EndDateTime: calculateDateTime(formatDate(nextDateProf2), "14:00", 35),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 2,
            ServiceStageId: 3,
            StartDateTime: calculateDateTime(formatDate(nextDateProf2), "14:00", 35),
            EndDateTime: calculateDateTime(formatDate(nextDateProf2), "14:00", 50),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 2,
            ServiceStageId: 4,
            StartDateTime: calculateDateTime(formatDate(nextDateProf2), "14:00", 50),
            EndDateTime: calculateDateTime(formatDate(nextDateProf2), "14:00", 80),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 2,
            ServiceStageId: 5,
            StartDateTime: calculateDateTime(formatDate(nextDateProf2), "14:00", 80),
            EndDateTime: calculateDateTime(formatDate(nextDateProf2), "14:00", 90),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },

        // Etapas para la cita 3 (reprogramada, servicio 2)
        {
            AppointmentId: 3,
            ServiceStageId: 6, // Servicio 2, Etapa 1
            StartDateTime: calculateDateTime(formatDate(nextWeek), "15:00", 0),
            EndDateTime: calculateDateTime(formatDate(nextWeek), "15:00", 20),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 3,
            ServiceStageId: 7, // Servicio 2, Etapa 2
            StartDateTime: calculateDateTime(formatDate(nextWeek), "15:00", 20),
            EndDateTime: calculateDateTime(formatDate(nextWeek), "15:00", 50),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 3,
            ServiceStageId: 8, // Servicio 2, Etapa 3
            StartDateTime: calculateDateTime(formatDate(nextWeek), "15:00", 50),
            EndDateTime: calculateDateTime(formatDate(nextWeek), "15:00", 90),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },

        // Etapas para las citas 4-7 (resumidas por simplicidad, pero seguirían el mismo patrón)
        // Cita 4 - Cancelada, pero las etapas aún están registradas
        {
            AppointmentId: 4,
            ServiceStageId: 9, // Servicio 3, Etapa 1
            StartDateTime: calculateDateTime(formatDate(nextDateProf3), "10:00", 0),
            EndDateTime: calculateDateTime(formatDate(nextDateProf3), "10:00", 30),
            BlsProfessionalBusy: true, // Aunque está cancelada, las etapas estaban ocupadas originalmente
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 4,
            ServiceStageId: 10, // Servicio 3, Etapa 2
            StartDateTime: calculateDateTime(formatDate(nextDateProf3), "10:00", 30),
            EndDateTime: calculateDateTime(formatDate(nextDateProf3), "10:00", 60),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            AppointmentId: 4,
            ServiceStageId: 11, // Servicio 3, Etapa 3
            StartDateTime: calculateDateTime(formatDate(nextDateProf3), "10:00", 60),
            EndDateTime: calculateDateTime(formatDate(nextDateProf3), "10:00", 90),
            BlsProfessionalBusy: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

    await appointmentStageRepository.insert(appointmentStages);
};