export class ClientResponseDto {
    Id: number;
    VcIdentificationNumber: string;
    VcPhone: string;
    VcNickName: string;
    VcFirstName: string;
    VcSecondName?: string;
    VcFirstLastName: string;
    VcSecondLastName?: string;
    VcEmail: string;
  }

  export class ClientRequestDto {
    VcIdentificationNumber: string;
    VcPhone: string;
    VcNickName?: string;
    VcFirstName: string;
    VcSecondName?: string;
    VcFirstLastName?: string;
    VcSecondLastName?: string;
    VcEmail: string;
  }
