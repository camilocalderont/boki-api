import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { configApi } from '../../../config';

@Injectable()
export class EmbeddingService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: configApi.OPENAI_API_KEY,
    });
  }

  /**
   * Genera un embedding para un texto dado
   */
  async generateEmbedding(text: string): Promise<{ 
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
        completionTokens: response.usage?.total_tokens ? 
          response.usage.total_tokens - (response.usage.prompt_tokens || 0) : 0
      }
    };
  }

  /**
   * Extrae palabras clave del mensaje removiendo stop words
   */
  extractKeywords(message: string): string {
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
}