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

  async searchSimilarFaqs(userMessage: string, idIntencion?: number | null): Promise<SearchResponse> {
    
    let totalTokensEntrada = 0;
    let totalTokensSalida = 0;

    // Si no hay idIntencion, retornar null
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

    // Generar embedding del mensaje del usuario
    const { embedding, tokensUsed } = await this.generateEmbeddingWithTokens(userMessage);
    
    totalTokensEntrada += tokensUsed.promptTokens;
    totalTokensSalida += tokensUsed.completionTokens;

    // Buscar FAQs similares
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

    // Si no hay resultados, retornar null
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

    // Formatear respuesta igual que la consulta original
    const data_facs = result.map(row => ({
      vc_question: row.vc_question,
      vc_answer: row.vc_answer,
    }));
    
    return { 
      data_facs,
      tokens: {
        TotalTokensEntrada: totalTokensEntrada,
        TotalTokensSalida: totalTokensSalida,
        TotalTokens: totalTokensEntrada + totalTokensSalida
      }
    };
  }

  async generateAllFaqEmbeddings(): Promise<{ message: string; processed: number; tokens: TokenUsage }> {

    let totalTokensEntrada = 0;
    let totalTokensSalida = 0;

    // Obtener todas las FAQs sin embedding
    const faqs = await this.dataSource.query(`
      SELECT "Id", vc_question, vc_answer 
      FROM "Faqs" 
      WHERE embedding IS NULL
    `);

    let processed = 0;

    for (const faq of faqs) {
      try {
        // Combinar pregunta y respuesta para mejor contexto
        const text = `${faq.vc_question} ${faq.vc_answer}`;
        
        // Generar embedding con tracking de tokens
        const { embedding, tokensUsed } = await this.generateEmbeddingWithTokens(text);
        
        totalTokensEntrada += tokensUsed.promptTokens;
        totalTokensSalida += tokensUsed.completionTokens;
        
        // Actualizar FAQ con embedding
        await this.dataSource.query(`
          UPDATE "Faqs" 
          SET embedding = $1::vector 
          WHERE "Id" = $2
        `, [JSON.stringify(embedding), faq.Id]);
        
        processed++;
        
        // Pausa para evitar rate limits de OpenAI
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        this.logger.error(`Error processing FAQ ${faq.Id}:`, error);
      }
    }

    const totalTokens = totalTokensEntrada + totalTokensSalida;
    
    return {
      message: `Successfully generated embeddings for ${processed} FAQs`,
      processed,
      tokens: {
        TotalTokensEntrada: totalTokensEntrada,
        TotalTokensSalida: totalTokensSalida,
        TotalTokens: totalTokens
      }
    };
  }

  private async generateEmbeddingWithTokens(text: string): Promise<{ embedding: number[]; tokensUsed: { promptTokens: number; completionTokens: number } }> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return {
      embedding: response.data[0].embedding,
      tokensUsed: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.total_tokens ? response.usage.total_tokens - (response.usage.prompt_tokens || 0) : 0
      }
    };
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  }
}