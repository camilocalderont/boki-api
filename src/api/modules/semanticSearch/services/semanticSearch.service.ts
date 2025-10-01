import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import OpenAI from 'openai';
import { configApi } from '../../../config';

interface TokenUsage {
  TotalTokensEntrada: number;
  TotalTokensSalida: number;
  TotalTokens: number;
}

interface SearchResponse {
  data_facs: any[] | null;
  tokens: TokenUsage;
}

interface ServiceSearchResponse {
  services: Array<{
    id: number;
    vc_name: string;
    similarity: number;
  }> | null;
  tokens: TokenUsage;
}

@Injectable()
export class SemanticSearchService {
  private readonly logger = new Logger(SemanticSearchService.name);
  private openai: OpenAI;

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    this.openai = new OpenAI({
      apiKey: configApi.OPENAI_API_KEY,
    });
  }

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
      const cleanedMessage = this.extractKeywords(userMessage);
      
      // Usar el mensaje limpio si tiene contenido, sino usar el original
      const messageToUse = cleanedMessage.length > 0 ? cleanedMessage : userMessage;
      
      this.logger.log(`Original: "${userMessage}" → Cleaned: "${messageToUse}"`);
      
      // Generar embedding
      const { embedding, tokensUsed } = await this.generateEmbeddingWithTokens(messageToUse);
      
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

      const result = await this.dataSource.query(query, [
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

    let totalTokensEntrada = 0;
    let totalTokensSalida = 0;

    try {
      const services = await this.dataSource.query(`
        SELECT "Id", vc_name 
        FROM "CategoryService" 
        WHERE embedding IS NULL
      `);

      this.logger.log(`Found ${services.length} services without embeddings`);

      let processed = 0;

      for (const service of services) {
        try {
          this.logger.log(`Processing: "${service.vc_name}"`);
          
          const { embedding, tokensUsed } = await this.generateEmbeddingWithTokens(service.vc_name);
          
          totalTokensEntrada += tokensUsed.promptTokens;
          totalTokensSalida += tokensUsed.completionTokens;
          
          await this.dataSource.query(`
            UPDATE "CategoryService" 
            SET embedding = $1::vector 
            WHERE "Id" = $2
          `, [JSON.stringify(embedding), service.Id]);
          
          processed++;
          
          this.logger.log(`Processed service ${service.Id}: ${service.vc_name}`);
          
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          this.logger.error(`Error processing service ${service.Id}:`, error);
        }
      }

      const totalTokens = totalTokensEntrada + totalTokensSalida;
      
      this.logger.log(`Completed: ${processed}/${services.length} services processed`);
      
      return {
        message: `Successfully generated embeddings for ${processed} services`,
        processed,
        tokens: {
          TotalTokensEntrada: totalTokensEntrada,
          TotalTokensSalida: totalTokensSalida,
          TotalTokens: totalTokens
        }
      };
    } catch (error) {
      this.logger.error('Error generating service embeddings:', error);
      throw error;
    }
  }

  // ============================================
  // BÚSQUEDA SEMÁNTICA DE FAQs
  // ============================================
  async searchSimilarFaqs(userMessage: string, idIntencion?: number | null): Promise<SearchResponse> {
    
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
      const { embedding, tokensUsed } = await this.generateEmbeddingWithTokens(userMessage);
      
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

      const result = await this.dataSource.query(query, [
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

    let totalTokensEntrada = 0;
    let totalTokensSalida = 0;

    try {
      const faqs = await this.dataSource.query(`
        SELECT "Id", vc_question, vc_answer 
        FROM "Faqs" 
        WHERE embedding IS NULL
      `);

      this.logger.log(`Found ${faqs.length} FAQs without embeddings`);

      let processed = 0;

      for (const faq of faqs) {
        try {
          const text = `${faq.vc_question}`;
          
          const { embedding, tokensUsed } = await this.generateEmbeddingWithTokens(text);
          
          totalTokensEntrada += tokensUsed.promptTokens;
          totalTokensSalida += tokensUsed.completionTokens;
          
          await this.dataSource.query(`
            UPDATE "Faqs" 
            SET embedding = $1::vector 
            WHERE "Id" = $2
          `, [JSON.stringify(embedding), faq.Id]);
          
          processed++;
          
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          this.logger.error(`Error processing FAQ ${faq.Id}:`, error);
        }
      }

      const totalTokens = totalTokensEntrada + totalTokensSalida;
      
      this.logger.log(`Completed: ${processed}/${faqs.length} FAQs processed`);
      
      return {
        message: `Successfully generated embeddings for ${processed} FAQs`,
        processed,
        tokens: {
          TotalTokensEntrada: totalTokensEntrada,
          TotalTokensSalida: totalTokensSalida,
          TotalTokens: totalTokens
        }
      };
    } catch (error) {
      this.logger.error('Error generating FAQ embeddings:', error);
      throw error;
    }
  }

  // ============================================
  // MÉTODOS PRIVADOS - PROCESAMIENTO DE TEXTO
  // ============================================

  /**
   * Extrae palabras clave del mensaje removiendo stop words
   */
  private extractKeywords(message: string): string {
    const stopWords = [
      // Verbos comunes
      'quiero', 'necesito', 'busco', 'solicitar', 'solicito', 'deseo',
      'requiero', 'quisiera', 'gustaria', 'puedo', 'puede', 'hacer',
      'hacerme', 'tener', 'ser', 'estar',
      // Artículos
      'un', 'una', 'unos', 'unas', 'el', 'la', 'los', 'las',
      // Preposiciones
      'de', 'del', 'para', 'por', 'con', 'sin', 'sobre',
      // Pronombres
      'me', 'mi', 'tu', 'su', 'le', 'lo', 'te',
      // Otros
      'que', 'como', 'donde', 'cuando', 'y', 'o', 'pero', 'si', 'no'
    ];
    
    const words = message
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .split(/\s+/);
    
    const keywords = words.filter(word => 
      word.length > 2 && !stopWords.includes(word)
    );
    
    return keywords.join(' ');
  }

  // ============================================
  // MÉTODOS PRIVADOS - OPENAI
  // ============================================

  private async generateEmbeddingWithTokens(text: string): Promise<{ 
    embedding: number[]; 
    tokensUsed: { promptTokens: number; completionTokens: number } 
  }> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
      dimensions: 1536  // Compatible con pg14
    });

    return {
      embedding: response.data[0].embedding,
      tokensUsed: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.total_tokens ? response.usage.total_tokens - (response.usage.prompt_tokens || 0) : 0
      }
    };
  }
}