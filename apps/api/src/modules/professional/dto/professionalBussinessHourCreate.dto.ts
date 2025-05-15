export class CreateProfessionalBussinessHourDto {
  ProfessionalId?: number; 
  IDayOfWeek: number;
  TStartTime: Date;
  TEndTime: Date;
  TBreakStartTime?: Date;
  TBreakEndTime?: Date;
  VcNotes?: string;
  CompanyBranchRoomId: number;
}