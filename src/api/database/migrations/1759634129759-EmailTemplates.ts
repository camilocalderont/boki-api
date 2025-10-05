import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailTemplates1759634129759 implements MigrationInterface {
    name = 'EmailTemplates1759634129759'

     public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);
        
        await queryRunner.query(`CREATE TABLE "EmailTemplates" (
            "Id" SERIAL NOT NULL, 
            "category_name" VARCHAR(255) NOT NULL, 
            "context_description" TEXT NOT NULL, 
            "company_id" integer NOT NULL, 
            "embedding" vector(1536), 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_EmailTemplates_Id" PRIMARY KEY ("Id")
        )`);
        
        await queryRunner.query(`ALTER TABLE "EmailTemplates" ADD CONSTRAINT "FK_EmailTemplates_Company" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        // índice para búsqueda vectorial
        await queryRunner.query(`CREATE INDEX "IDX_EmailTemplates_embedding" ON "EmailTemplates" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_EmailTemplates_embedding"`);
        await queryRunner.query(`ALTER TABLE "EmailTemplates" DROP CONSTRAINT "FK_EmailTemplates_Company"`);
        await queryRunner.query(`DROP TABLE "EmailTemplates"`);
    }

}
