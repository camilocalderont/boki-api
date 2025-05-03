import { CreateAppointmentStageDto } from "./appointmentStageCreate.dto";
import { CreateAppointmentStateDto } from "./appointmentStateCreate.dto";

export class CreateAppointmentDto {
    ClientId: number;
    ServiceId: number;
    ProfessionalId: number;
    DtDate: Date;
    TTime: string;
    CurrentStateId: number;
    BIsCompleted: boolean;
    BIsAbsent: boolean;
    AppointmentStages: CreateAppointmentStageDto[];
    AppointmentStates: CreateAppointmentStateDto[];
}
