import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SemanticSearchRepository {
  private readonly logger = new Logger(SemanticSearchRepository.name);

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Búsqueda semántica genérica por embedding
   */
  async searchByEmbedding<T>(
    tableName: string,
    embedding: number[],
    whereClause: string,
    params: any[],
    limit: number = 3,
    selectFields: string[] = ['*']
  ): Promise<T[]> {
    const fields = selectFields.join(', ');
    
    const query = `
      SELECT 
        ${fields},
        (1 - (embedding <=> $1::vector)) as similarity
      FROM "${tableName}"
      WHERE ${whereClause}
        AND embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT ${limit}
    `;

    return await this.dataSource.query(query, [
      JSON.stringify(embedding),
      ...params
    ]);
  }

  /**
   * Actualiza el embedding de un registro
   */
  async updateEmbedding(
    tableName: string,
    idField: string,
    id: any,
    embedding: number[]
  ): Promise<void> {
    await this.dataSource.query(`
      UPDATE "${tableName}" 
      SET embedding = $1::vector 
      WHERE "${idField}" = $2
    `, [JSON.stringify(embedding), id]);
  }

  /**
   * Obtiene registros sin embeddings
   */
  async getRecordsWithoutEmbeddings(
    tableName: string,
    fields: string[]
  ): Promise<any[]> {
    const fieldList = fields.join(', ');
    return await this.dataSource.query(`
      SELECT ${fieldList}
      FROM "${tableName}" 
      WHERE embedding IS NULL
    `);
  }

  /**
   * Ejecuta una query SQL raw
   */
  async executeRawQuery(query: string, params: any[]): Promise<any[]> {
    return await this.dataSource.query(query, params);
  }
}