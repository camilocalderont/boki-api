import { Injectable, Logger, Inject } from '@nestjs/common';
import { EmbeddingService } from '../embedding/embedding.service';
import { SemanticSearchRepository } from '../repositories/semantic-search.repository';
import {
  TokenUsage,
  SearchResponse,
  ServiceSearchResponse,
  EmailTemplateSearchResponse
} from '../dto/semanticSearch.dto';

@Injectable()
export class SemanticSearchService {
  private readonly logger = new Logger(SemanticSearchService.name);

  constructor(
    @Inject(EmbeddingService)
    private readonly embeddingService: EmbeddingService,
    @Inject(SemanticSearchRepository)
    private readonly searchRepository: SemanticSearchRepository,
  ) { }

  // ============================================
  // BÚSQUEDA SEMÁNTICA DE SERVICIOS
  // ============================================
  async searchSimilarServices(
    userMessage: string,
    companyId: string
  ): Promise<ServiceSearchResponse> {

    let totalTokensEntrada = 0;
    let totalTokensSalida = 0;

    try {
      // Limpiar el mensaje extrayendo keywords
      const cleanedMessage = this.embeddingService.extractKeywords(userMessage);

      // Usar el mensaje limpio si tiene contenido, sino usar el original
      const messageToUse = cleanedMessage.length > 0 ? cleanedMessage : userMessage;

      this.logger.log(`Original: "${userMessage}" → Cleaned: "${messageToUse}"`);

      // Generar embedding
      const { embedding, tokensUsed } = await this.embeddingService.generateEmbedding(messageToUse);

      totalTokensEntrada += tokensUsed.promptTokens;
      totalTokensSalida += tokensUsed.completionTokens;

      // Buscar servicios similares
      const query = `
        SELECT 
          cs."Id" as id,
          cs.vc_name,
          (1 - (cs.embedding <=> $1::vector)) as similarity
        FROM "CategoryService" cs
        WHERE cs.company_id = $2
          AND cs.embedding IS NOT NULL
        ORDER BY cs.embedding <=> $1::vector
        LIMIT 3
      `;

      const result = await this.searchRepository.executeRawQuery(query, [
        JSON.stringify(embedding),
        companyId,
      ]);

      if (!result || result.length === 0) {
        this.logger.warn(`No services found for company ${companyId}`);
        return {
          services: null,
          tokens: {
            TotalTokensEntrada: totalTokensEntrada,
            TotalTokensSalida: totalTokensSalida,
            TotalTokens: totalTokensEntrada + totalTokensSalida
          }
        };
      }

      const services = result.map(row => ({
        id: row.id,
        vc_name: row.vc_name,
        similarity: parseFloat(row.similarity.toFixed(4))
      }));

      this.logger.log(`Found ${services.length} similar services. Top match: ${services[0].vc_name} (${(services[0].similarity * 100).toFixed(1)}%)`);

      return {
        services,
        tokens: {
          TotalTokensEntrada: totalTokensEntrada,
          TotalTokensSalida: totalTokensSalida,
          TotalTokens: totalTokensEntrada + totalTokensSalida
        }
      };
    } catch (error) {
      this.logger.error('Error searching similar services:', error);
      throw error;
    }
  }

  // ============================================
  // GENERAR EMBEDDINGS PARA SERVICIOS
  // ============================================
  async generateAllServiceEmbeddings(): Promise<{
    message: string;
    processed: number;
    tokens: TokenUsage
  }> {
    return this.generateEmbeddingsForEntity(
      'CategoryService',
      'Id',
      ['Id', 'vc_name'],
      (record) => record.vc_name
    );
  }

  // ============================================
  // BÚSQUEDA SEMÁNTICA DE FAQs
  // ============================================
  async searchSimilarFaqs(
    userMessage: string,
    idIntencion?: number | null
  ): Promise<SearchResponse> {

    let totalTokensEntrada = 0;
    let totalTokensSalida = 0;

    if (!idIntencion) {
      return {
        data_facs: null,
        tokens: {
          TotalTokensEntrada: 0,
          TotalTokensSalida: 0,
          TotalTokens: 0
        }
      };
    }

    try {
      const { embedding, tokensUsed } = await this.embeddingService.generateEmbedding(userMessage);

      totalTokensEntrada += tokensUsed.promptTokens;
      totalTokensSalida += tokensUsed.completionTokens;

      const query = `
        SELECT 
          f.vc_question,
          f.vc_answer,
          (1 - (f.embedding <=> $1::vector)) as similarity
        FROM "Faqs" f
        WHERE f.category_service_id = $2
          AND f.embedding IS NOT NULL
        ORDER BY f.embedding <=> $1::vector
        LIMIT 3
      `;

      const result = await this.searchRepository.executeRawQuery(query, [
        JSON.stringify(embedding),
        idIntencion,
      ]);

      if (!result || result.length === 0) {
        return {
          data_facs: null,
          tokens: {
            TotalTokensEntrada: totalTokensEntrada,
            TotalTokensSalida: totalTokensSalida,
            TotalTokens: totalTokensEntrada + totalTokensSalida
          }
        };
      }

      const data_facs = result.map(row => ({
        vc_question: row.vc_question,
        vc_answer: row.vc_answer,
        similarity: parseFloat(row.similarity.toFixed(4))
      }));

      return {
        data_facs,
        tokens: {
          TotalTokensEntrada: totalTokensEntrada,
          TotalTokensSalida: totalTokensSalida,
          TotalTokens: totalTokensEntrada + totalTokensSalida
        }
      };
    } catch (error) {
      this.logger.error('Error searching similar FAQs:', error);
      throw error;
    }
  }

  // ============================================
  // GENERAR EMBEDDINGS PARA FAQs
  // ============================================
  async generateAllFaqEmbeddings(): Promise<{
    message: string;
    processed: number;
    tokens: TokenUsage
  }> {
    return this.generateEmbeddingsForEntity(
      'Faqs',
      'Id',
      ['Id', 'vc_question', 'vc_answer'],
      (record) => record.vc_question
    );
  }

  // ============================================
  // BÚSQUEDA SEMÁNTICA DE EMAIL TEMPLATES
  // ============================================
  async searchSimilarEmailTemplates(
    userMessage: string,
    companyId: string
  ): Promise<EmailTemplateSearchResponse> {

    let totalTokensEntrada = 0;
    let totalTokensSalida = 0;

    try {
      this.logger.log(`Searching templates with full message: "${userMessage}"`);

      const { embedding, tokensUsed } = await this.embeddingService.generateEmbedding(userMessage);

      totalTokensEntrada += tokensUsed.promptTokens;
      totalTokensSalida += tokensUsed.completionTokens;

      // Buscar templates similares
      const query = `
      SELECT 
        et."Id" as id,
        et.category_name as "categoryName",
        et.context_description as "contextDescription",
        et.search_keywords as "searchKeywords",
        (1 - (et.embedding <=> $1::vector)) as similarity
      FROM "EmailTemplates" et
      WHERE et."company_id" = $2
        AND et.embedding IS NOT NULL
      ORDER BY et.embedding <=> $1::vector
      LIMIT 3
    `;

      const result = await this.searchRepository.executeRawQuery(query, [
        JSON.stringify(embedding),
        companyId,
      ]);

      if (!result || result.length === 0) {
        this.logger.warn(`No email templates found for company ${companyId}`);
        return {
          templates: null,
          tokens: {
            TotalTokensEntrada: totalTokensEntrada,
            TotalTokensSalida: totalTokensSalida,
            TotalTokens: totalTokensEntrada + totalTokensSalida
          }
        };
      }

      const templates = result.map(row => ({
        id: row.id,
        categoryName: row.categoryName,
        contextDescription: row.contextDescription,
        searchKeywords: row.searchKeywords,
        similarity: parseFloat(row.similarity.toFixed(4))
      }));

      this.logger.log(`Found ${templates.length} similar templates. Top match: ${templates[0].categoryName} (${(templates[0].similarity * 100).toFixed(1)}%)`);

      return {
        templates,
        tokens: {
          TotalTokensEntrada: totalTokensEntrada,
          TotalTokensSalida: totalTokensSalida,
          TotalTokens: totalTokensEntrada + totalTokensSalida
        }
      };
    } catch (error) {
      this.logger.error('Error searching similar email templates:', error);
      throw error;
    }
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  /**
   * Método genérico para generar embeddings de cualquier entidad
   */
  private async generateEmbeddingsForEntity(
    tableName: string,
    idField: string,
    fields: string[],
    textExtractor: (record: any) => string
  ): Promise<{ message: string; processed: number; tokens: TokenUsage }> {

    let totalTokensEntrada = 0;
    let totalTokensSalida = 0;

    const records = await this.searchRepository.getRecordsWithoutEmbeddings(
      tableName,
      fields
    );

    this.logger.log(`Found ${records.length} ${tableName} without embeddings`);

    let processed = 0;

    for (const record of records) {
      try {
        const text = textExtractor(record);
        this.logger.log(`Processing: "${text}"`);

        const { embedding, tokensUsed } = await this.embeddingService.generateEmbedding(text);

        totalTokensEntrada += tokensUsed.promptTokens;
        totalTokensSalida += tokensUsed.completionTokens;

        await this.searchRepository.updateEmbedding(
          tableName,
          idField,
          record[idField],
          embedding
        );

        processed++;

        this.logger.log(`Processed ${tableName} ${record[idField]}: ${text}`);

        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        this.logger.error(`Error processing ${tableName} ${record[idField]}:`, error);
      }
    }

    this.logger.log(`Completed: ${processed}/${records.length} ${tableName} processed`);

    return {
      message: `Successfully generated embeddings for ${processed} ${tableName}`,
      processed,
      tokens: {
        TotalTokensEntrada: totalTokensEntrada,
        TotalTokensSalida: totalTokensSalida,
        TotalTokens: totalTokensEntrada + totalTokensSalida
      }
    };
  }
}