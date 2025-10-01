import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SemanticSearchDto {
  @IsString()
  userMessage: string;

  @IsOptional()
  @IsNumber()
  idIntencion?: number | null;
}

export class ServiceSearchDto {
  @IsString()
  userMessage: string;

  @IsString()
  companyId: string;
}