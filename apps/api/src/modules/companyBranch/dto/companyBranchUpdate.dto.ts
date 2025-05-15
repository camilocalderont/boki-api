import { UpdateCompanyBranchRoomDto } from './companyBranchRoomUpdate.dto';

export class UpdateCompanyBranchDto {
  CompanyId?: number;
  VcName?: string;
  VcDescription?: string;
  VcAddress?: string;
  VcEmail?: string;
  VcPhone?: string;
  VcBranchManagerName?: string;
  VcImage?: string;
  BIsPrincipal?: boolean;
  CompanyBranchRooms?: UpdateCompanyBranchRoomDto[];
}
