import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmbeddingToFaqs1759111785565 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS vector;
    `);

        await queryRunner.query(`
      ALTER TABLE "Faqs" 
      ADD COLUMN embedding vector(1536);
    `);

        await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS faqs_embedding_idx 
      ON "Faqs" 
      USING ivfflat (embedding vector_cosine_ops) 
      WITH (lists = 100);
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS faqs_embedding_idx;`);
        await queryRunner.query(`ALTER TABLE "Faqs" DROP COLUMN embedding;`);
    }

}
