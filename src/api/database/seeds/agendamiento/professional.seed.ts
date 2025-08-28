import { DataSource } from 'typeorm';
import { ProfessionalEntity } from '../../../modules/professional/entities/professional.entity';
import { ProfessionalBussinessHourEntity } from '../../../modules/professional/entities/professionalBussinessHour.entity';
import { ProfessionalServiceEntity } from '../../../modules/professional/entities/professionalService.entity';

export const professionalSeed = async (dataSource: DataSource): Promise<void> => {
    const professionalRepository = dataSource.getRepository(ProfessionalEntity);
    const businessHourRepository = dataSource.getRepository(ProfessionalBussinessHourEntity);
    const professionalServiceRepository = dataSource.getRepository(ProfessionalServiceEntity);

    const existingProfessionals = await professionalRepository.find();
    if (existingProfessionals.length > 0) {
        return;
    }

    const professionals = [
        {
            Id: 1,
            VcFirstName: "Luis",
            VcFirstLastName: "López",
            VcEmail: "luis.lopez@ejemplo.com",
            VcIdentificationNumber: "1098765431",
            VcPhone: "3004455566",
            VcLicenseNumber: "adadada",
            IYearsOfExperience: 7,
            TxPhoto: null,
            VcProfession: "Estilista",
            VcSpecialization: "Uñas",
            CompanyId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            Id: 2,
            VcFirstName: "María",
            VcFirstLastName: "Jiménez",
            VcEmail: "maria.jimenez@ejemplo.com",
            VcIdentificationNumber: "1098765432",
            VcPhone: "3004455567",
            VcLicenseNumber: "bbbbbb",
            IYearsOfExperience: 5,
            TxPhoto: null,
            VcProfession: "Manicurista",
            VcSpecialization: "Uñas Acrílicas",
            CompanyId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            Id: 3,
            VcFirstName: "Carlos",
            VcFirstLastName: "Ramírez",
            VcEmail: "carlos.ramirez@ejemplo.com",
            VcIdentificationNumber: "1098765433",
            VcPhone: "3004455568",
            VcLicenseNumber: "cccccc",
            IYearsOfExperience: 8,
            TxPhoto: null,
            VcProfession: "Peluquero",
            VcSpecialization: "Cortes y Peinados",
            CompanyId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

    await professionalRepository.insert(professionals);

    // Crear horarios laborales que cubran todos los días de la semana
    const businessHours = [
        // Luis - Lunes
        {
            ProfessionalId: 1,
            IDayOfWeek: 1, // Lunes
            TStartTime: "08:00:00",
            TEndTime: "12:00:00",
            TBreakStartTime: null,
            TBreakEndTime: null,
            CompanyBranchRoomId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            ProfessionalId: 1,
            IDayOfWeek: 1, // Lunes
            TStartTime: "14:00:00",
            TEndTime: "18:00:00",
            TBreakStartTime: null,
            TBreakEndTime: null,
            CompanyBranchRoomId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Luis - Miércoles
        {
            ProfessionalId: 1,
            IDayOfWeek: 3, // Miércoles
            TStartTime: "09:00:00",
            TEndTime: "17:00:00",
            TBreakStartTime: "13:00:00",
            TBreakEndTime: "14:00:00",
            CompanyBranchRoomId: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Luis - Viernes
        {
            ProfessionalId: 1,
            IDayOfWeek: 5, // Viernes
            TStartTime: "10:00:00",
            TEndTime: "19:00:00",
            TBreakStartTime: "14:00:00",
            TBreakEndTime: "15:00:00",
            CompanyBranchRoomId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // María - Martes
        {
            ProfessionalId: 2,
            IDayOfWeek: 2, // Martes
            TStartTime: "08:00:00",
            TEndTime: "17:00:00",
            TBreakStartTime: "12:00:00",
            TBreakEndTime: "13:00:00",
            CompanyBranchRoomId: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // María - Jueves
        {
            ProfessionalId: 2,
            IDayOfWeek: 4, // Jueves
            TStartTime: "08:00:00",
            TEndTime: "17:00:00",
            TBreakStartTime: "12:00:00",
            TBreakEndTime: "13:00:00",
            CompanyBranchRoomId: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // María - Sábado
        {
            ProfessionalId: 2,
            IDayOfWeek: 6, // Sábado
            TStartTime: "09:00:00",
            TEndTime: "14:00:00",
            TBreakStartTime: null,
            TBreakEndTime: null,
            CompanyBranchRoomId: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Carlos - Lunes a Viernes
        {
            ProfessionalId: 3,
            IDayOfWeek: 1, // Lunes
            TStartTime: "08:00:00",
            TEndTime: "16:00:00",
            TBreakStartTime: "12:00:00",
            TBreakEndTime: "13:00:00",
            CompanyBranchRoomId: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            ProfessionalId: 3,
            IDayOfWeek: 2, // Martes
            TStartTime: "08:00:00",
            TEndTime: "16:00:00",
            TBreakStartTime: "12:00:00",
            TBreakEndTime: "13:00:00",
            CompanyBranchRoomId: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            ProfessionalId: 3,
            IDayOfWeek: 3, // Miércoles
            TStartTime: "08:00:00",
            TEndTime: "16:00:00",
            TBreakStartTime: "12:00:00",
            TBreakEndTime: "13:00:00",
            CompanyBranchRoomId: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            ProfessionalId: 3,
            IDayOfWeek: 4, // Jueves
            TStartTime: "08:00:00",
            TEndTime: "16:00:00",
            TBreakStartTime: "12:00:00",
            TBreakEndTime: "13:00:00",
            CompanyBranchRoomId: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            ProfessionalId: 3,
            IDayOfWeek: 5, // Viernes
            TStartTime: "08:00:00",
            TEndTime: "16:00:00",
            TBreakStartTime: "12:00:00",
            TBreakEndTime: "13:00:00",
            CompanyBranchRoomId: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

    await businessHourRepository.insert(businessHours);

    // Asignar servicios a los profesionales
    const professionalServices = [
        // Luis ofrece servicios 1 y 2
        {
            ProfessionalId: 1,
            ServiceId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            ProfessionalId: 1,
            ServiceId: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // María ofrece servicios 1, 2 y 3
        {
            ProfessionalId: 2,
            ServiceId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            ProfessionalId: 2,
            ServiceId: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            ProfessionalId: 2,
            ServiceId: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        // Carlos ofrece servicios 3 y 4
        {
            ProfessionalId: 3,
            ServiceId: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            ProfessionalId: 3,
            ServiceId: 4,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

    await professionalServiceRepository.insert(professionalServices);
};