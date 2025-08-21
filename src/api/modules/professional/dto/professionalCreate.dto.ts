import { CreateProfessionalBussinessHourDto } from './professionalBussinessHourCreate.dto';
import { CreateProfessionalServiceDto } from './professionalServiceCreate.dto';

export class CreateProfessionalDto {
  VcFirstName: string;
  VcSecondName?: string;
  VcFirstLastName: string;
  VcSecondLastName?: string;
  VcEmail: string;
  VcPhone?: string;
  VcIdentificationNumber: string;
  VcLicenseNumber?: string;
  IYearsOfExperience?: number;
  TxPhoto?: string;
  VcProfession: string;
  VcSpecialization?: string;
  CompanyId: number;
  BussinessHours?: CreateProfessionalBussinessHourDto[];
  Services?: CreateProfessionalServiceDto[];
}
