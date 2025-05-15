import { UpdateProfessionalBussinessHourDto } from "./professionalBussinessHourUpdate.dto";
import { UpdateProfessionalServiceDto } from "./professionalServiceUpdate.dto";

export class UpdateProfessionalDto {
  VcFirstName?: string;
  VcSecondName?: string;
  VcFirstLastName?: string;
  VcSecondLastName?: string;
  VcEmail?: string;
  VcPhone?: string;
  VcIdentificationNumber?: string;
  VcLicenseNumber?: string;
  IYearsOfExperience?: number;
  TxPhoto?: string;
  VcProfession?: string;
  VcSpecialization?: string;
  BussinessHours?: UpdateProfessionalBussinessHourDto[];
  Services?: UpdateProfessionalServiceDto[];
}
