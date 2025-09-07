import { MigrationInterface, QueryRunner } from "typeorm";

export class CompanyPrompts1757215920748 implements MigrationInterface {
    name = 'CompanyPrompts1757215920748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CompanyPrompts" (
            "Id" SERIAL NOT NULL, 
            "company_id" integer NOT NULL, 
            "vc_description" character varying(255) NOT NULL, 
            "vc_internal_code" character varying(100) NOT NULL, 
            "tx_intention_prompt" text NOT NULL, 
            "tx_main_prompt" text NOT NULL, 
            "user_id" integer NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_CompanyPrompts_Id" PRIMARY KEY ("Id")
        )`);

        await queryRunner.query(`ALTER TABLE "CompanyPrompts" ADD CONSTRAINT "FK_CompanyPrompts_Company" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "CompanyPrompts" ADD CONSTRAINT "FK_CompanyPrompts_Users" FOREIGN KEY ("user_id") REFERENCES "Users"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CompanyPrompts" DROP CONSTRAINT "FK_CompanyPrompts_Users"`);
        await queryRunner.query(`ALTER TABLE "CompanyPrompts" DROP CONSTRAINT "FK_CompanyPrompts_Company"`);
        await queryRunner.query(`DROP TABLE "CompanyPrompts"`);
    }

}
