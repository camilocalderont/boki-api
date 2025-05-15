import { CreateCompanyBranchRoomDto } from './companyBranchRoomCreate.dto';

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
  CompanyBranchRoom?: CreateCompanyBranchRoomDto[];
}
