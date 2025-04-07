import { MigrationInterface, QueryRunner } from "typeorm";

export class Company1744053007514 implements MigrationInterface {
    name = 'Company1744053007514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Company" ("Id" SERIAL NOT NULL, "vc_name" character varying(100) NOT NULL, "vc_description" character varying(255), "vc_phone" character varying(20), "vc_principal_address" character varying(150), "vc_principal_email" character varying(100) NOT NULL, "vc_legal_representative" character varying(100), "vc_logo" character varying(255), "tx_images" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5f471f29996cc218989cd4dc164" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Company"`);
    }

}
