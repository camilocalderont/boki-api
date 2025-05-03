import { UpdateAppointmentStageDto } from "./appointmentStageUpdate.dto";
import { UpdateAppointmentStateDto } from "./appointmentStateUpdate.dto";


export class UpdateAppointmentDto {
    ClientId?: number;
    ServiceId?: number;
    ProfessionalId?: number;
    DtDate?: Date;
    TTime?: string;
    CurrentStateId?: number;
    BIsCompleted?: boolean;
    BIsAbsent?: boolean;
    AppointmentStages?: UpdateAppointmentStageDto[];
    AppointmentStates?: UpdateAppointmentStateDto[];
}
