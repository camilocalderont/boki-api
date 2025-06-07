export class CreateClientDto {
  CompanyId: number;
  VcIdentificationNumber: string;
  VcPhone: string;
  VcNickName?: string;
  VcFirstName: string;
  VcSecondName?: string;
  VcFirstLastName?: string;
  VcSecondLastName?: string;
  VcEmail?: string;
}
