import { MigrationInterface, QueryRunner } from "typeorm";

export class CrateServiceTable1744236810300 implements MigrationInterface {
    name = 'CrateServiceTable1744236810300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Service" ("Id" SERIAL NOT NULL, "vc_name" character varying(100) NOT NULL, "vc_description" character varying(500), "i_minimal_price" integer NOT NULL, "i_maximal_price" integer NOT NULL, "i_regular_price" integer NOT NULL, "d_taxes" numeric(5,2) NOT NULL DEFAULT '0', "vc_time" character varying(20) NOT NULL, "company_id" integer NOT NULL, "category_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c3d639ca800c6174b4b537d7dc6" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "Service" ADD CONSTRAINT "FK_6dc401eb2310729cde3b486bc35" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Service" ADD CONSTRAINT "FK_bb6a3a8c929d83f5b9aaaa87970" FOREIGN KEY ("category_id") REFERENCES "CategoryService"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Service" DROP CONSTRAINT "FK_bb6a3a8c929d83f5b9aaaa87970"`);
        await queryRunner.query(`ALTER TABLE "Service" DROP CONSTRAINT "FK_6dc401eb2310729cde3b486bc35"`);
        await queryRunner.query(`DROP TABLE "Service"`);
    }

}
