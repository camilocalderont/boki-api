export class UpdateAppointmentStateDto {
    StateId?: number;
    VcChangedBy?: string;
    VcReason?: string;
    DtDateTime?: Date;
    DtPreviousDate?: Date;
    TPreviousTime?: string;
    DtCurrentDate?: Date;
    TCurrentTime?: string;
}