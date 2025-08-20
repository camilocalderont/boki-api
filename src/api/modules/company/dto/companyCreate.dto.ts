export class CreateCompanyDto {
  VcName: string;
  VcDescription?: string;
  VcPhone?: string;
  VcPrincipalAddress?: string;
  VcPrincipalEmail: string;
  VcLegalRepresentative?: string;
  TxLogo?: string;
  TxImages?: string;
  UserId: number;
}
