export class UpdateCompanyBlockedTimeDto {
  CompanyId: number;
  DtInitDate: Date;
  DtEndDate: Date;
  VcMessage?: string;
}