import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFaqsAndFaqsTagsTables1746303745942 implements MigrationInterface {
    name = 'CreateFaqsAndFaqsTagsTables1746303745942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Faqs" ("Id" SERIAL NOT NULL, "vc_question" character varying(500) NOT NULL, "vc_answer" text NOT NULL, "company_id" integer NOT NULL, "category_service_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_15ff753d194249f326a6058b20d" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "Faqs_Tags" ("Id" SERIAL NOT NULL, "faqs_id" integer NOT NULL, "tags_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1f390df5931f7564060ffc93a26" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "Faqs" ADD CONSTRAINT "FK_f7af0d2fae0965e1fa16eee2ce9" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Faqs" ADD CONSTRAINT "FK_3831dd57561260265731b7fd1fb" FOREIGN KEY ("category_service_id") REFERENCES "CategoryService"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Faqs_Tags" ADD CONSTRAINT "FK_420ff57267c033531dbdbe4d2ee" FOREIGN KEY ("faqs_id") REFERENCES "Faqs"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Faqs_Tags" ADD CONSTRAINT "FK_16dba7a3a0bcedba2b8c87a286f" FOREIGN KEY ("tags_id") REFERENCES "Tags"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Faqs_Tags" DROP CONSTRAINT "FK_16dba7a3a0bcedba2b8c87a286f"`);
        await queryRunner.query(`ALTER TABLE "Faqs_Tags" DROP CONSTRAINT "FK_420ff57267c033531dbdbe4d2ee"`);
        await queryRunner.query(`ALTER TABLE "Faqs" DROP CONSTRAINT "FK_3831dd57561260265731b7fd1fb"`);
        await queryRunner.query(`ALTER TABLE "Faqs" DROP CONSTRAINT "FK_f7af0d2fae0965e1fa16eee2ce9"`);
        await queryRunner.query(`DROP TABLE "Faqs_Tags"`);
        await queryRunner.query(`DROP TABLE "Faqs"`);
    }

}
