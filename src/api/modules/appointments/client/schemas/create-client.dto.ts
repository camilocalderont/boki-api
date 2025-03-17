import { IsString, IsOptional, Length, IsEmail } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @Length(5, 50)
  VcIdentificationNumber: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  VcPhone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  vcNickName?: string;

  @IsString()
  @Length(1, 50)
  VcFirstName: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  VcSecondName?: string;

  @IsString()
  @Length(1, 50)
  VcFirstLastName: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  VcSecondLastName?: string;

  @IsEmail()
  @Length(5, 100)
  VcEmail: string;

  @IsString()
  @Length(6, 255)
  VcPassword: string;
}
