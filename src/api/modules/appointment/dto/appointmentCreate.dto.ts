import { CreateAppointmentStageDto } from "./appointmentStageCreate.dto";
import { CreateAppointmentStateDto } from "./appointmentStateCreate.dto";

export class CreateAppointmentDto {
    ClientId: number;
    ServiceId: number;
    ProfessionalId: number;
    DtDate: Date;
    TStartTime: string;
    CurrentStateId: number;
    BIsCompleted: boolean;
    BIsAbsent: boolean;
}
