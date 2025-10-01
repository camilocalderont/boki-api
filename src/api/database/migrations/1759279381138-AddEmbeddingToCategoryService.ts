import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmbeddingToCategoryService1759279381138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Asegurar que la extensión vector esté instalada (por si acaso)
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS vector;
        `);

        // Agregar columna embedding a CategoryService
        await queryRunner.query(`
            ALTER TABLE "CategoryService" 
            ADD COLUMN embedding vector(1536);
        `);

        // Crear índice para búsqueda rápida
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS categoryservice_embedding_idx 
            ON "CategoryService" 
            USING ivfflat (embedding vector_cosine_ops) 
            WITH (lists = 100);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar índice
        await queryRunner.query(`
            DROP INDEX IF EXISTS categoryservice_embedding_idx;
        `);

        // Eliminar columna
        await queryRunner.query(`
            ALTER TABLE "CategoryService" 
            DROP COLUMN embedding;
        `);
    }

}
