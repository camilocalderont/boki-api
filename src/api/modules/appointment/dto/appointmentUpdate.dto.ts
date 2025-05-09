import { UpdateAppointmentStageDto } from "./appointmentStageUpdate.dto";
import { UpdateAppointmentStateDto } from "./appointmentStateUpdate.dto";


export class UpdateAppointmentDto {
    ClientId?: number;
    ServiceId?: number;
    ProfessionalId?: number;
    DtDate?: Date;
    TStartTime?: string;
    CurrentStateId?: number;
    BIsCompleted?: boolean;
    BIsAbsent?: boolean;
}
