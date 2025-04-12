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
  
  // Opción 1: Actualizar salas existentes
  CompanyBranchRooms?: UpdateCompanyBranchRoomDto[];
  
  // Opción 2: Agregar nuevas salas
  NewCompanyBranchRooms?: Omit<UpdateCompanyBranchRoomDto, 'Id'>[];
  
  // Opción 3: IDs de salas a eliminar
  DeleteCompanyBranchRoomIds?: number[];
}
