import { IsString, IsOptional, IsNumber } from 'class-validator';

// ============================================
// DTOs para requests
// ============================================

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

// ============================================
// Interfaces para responses
// ============================================

export interface TokenUsage {
  TotalTokensEntrada: number;
  TotalTokensSalida: number;
  TotalTokens: number;
}

export interface SearchResponse {
  data_facs: Array<{
    vc_question: string;
    vc_answer: string;
    similarity: number;
  }> | null;
  tokens: TokenUsage;
}

export interface ServiceSearchResponse {
  services: Array<{
    id: number;
    vc_name: string;
    similarity: number;
  }> | null;
  tokens: TokenUsage;
}