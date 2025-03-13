import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @Length(1, 50)
  VcIdentificationNumber: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  VcPhone?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  vcNickName?: string;

  @IsString()
  @Length(1, 50)
  VcFirstName: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  VcSecondName?: string;

  @IsString()
  @Length(1, 50)
  VcFirstLastName: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  VcSecondLastName?: string;

  @IsEmail()
  @Length(1, 100)
  VcEmail: string;

  @IsString()
  @Length(6, 255)
  VcPassword: string;
}
