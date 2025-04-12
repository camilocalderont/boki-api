import { MigrationInterface, QueryRunner } from "typeorm";

export class CrateProfessionalTable1744058387963 implements MigrationInterface {
    name = 'CrateProfessionalTable1744058387963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Professional" ("Id" SERIAL NOT NULL, "vc_first_name" character varying(100) NOT NULL, "vc_second_name" character varying(100), "vc_first_last_name" character varying(100) NOT NULL, "vc_second_last_name" character varying(100), "vc_email" character varying(100) NOT NULL, "vc_phone" character varying(20), "vc_identification_number" character varying(20) NOT NULL, "vc_license_number" character varying(50), "i_years_of_experience" integer NOT NULL DEFAULT '0', "vc_photo" character varying(255), "vc_profession" character varying(100) NOT NULL, "vc_specialization" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ff1a0c3f36dc7c3d24136db7ed2" UNIQUE ("vc_email"), CONSTRAINT "UQ_c4ee48b2eec849f14d61f4dd793" UNIQUE ("vc_identification_number"), CONSTRAINT "PK_50893c86758b48db886741d1126" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Professional"`);
    }

}
