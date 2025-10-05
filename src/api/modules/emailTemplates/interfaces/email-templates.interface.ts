export interface EmailTemplateResponse {
  Id: number;
  CategoryName: string;
  ContextDescription: string;
  CompanyId: number;
  Embedding: number[] | null;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface EmailTemplateWithSimilarity extends EmailTemplateResponse {
  similarity?: number;
}