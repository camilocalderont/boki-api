export class CreateCompanyBranchDto {
  CompanyId: number;
  VcName: string;
  VcDescription?: string;
  VcAddress: string;
  VcEmail: string;
  VcPhone?: string;
  VcBranchManagerName?: string;
  VcImage?: string;
  BIsPrincipal?: boolean;
}
