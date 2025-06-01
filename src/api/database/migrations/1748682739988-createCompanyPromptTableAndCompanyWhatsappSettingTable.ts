import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompanyPromptTableAndCompanyWhatsappSettingTable1748682739988 implements MigrationInterface {
    name = 'CreateCompanyPromptTableAndCompanyWhatsappSettingTable1748682739988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CompanyWhatsappSetting" ("Id" SERIAL NOT NULL, "company_id" integer NOT NULL, "vc_phone_number_id" character varying(250) NOT NULL, "vc_phone_number" character varying(20) NOT NULL, "vc_display_name" character varying(100) NOT NULL, "vc_access_token" character varying(250) NOT NULL, "vc_bot_name" character varying(100) NOT NULL, "b_is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8aa7866e5d7d9dd8d70fe95a2ef" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f747ac91b0e98833a1d501eea0" ON "CompanyWhatsappSetting" ("company_id") `);
        await queryRunner.query(`CREATE TABLE "CompanyPrompt" ("Id" SERIAL NOT NULL, "company_id" integer NOT NULL, "vc_prompt_type" character varying(100) NOT NULL, "tx_prompt_template" text NOT NULL, "b_is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8ed73ca93a8727e92cc52bf6084" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4217c153d674e3ac353302c303" ON "CompanyPrompt" ("company_id") `);
        await queryRunner.query(`ALTER TABLE "CategoryService" ADD "company_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Client" ADD "company_id" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_7e28a3e2e70c4c47f518ac21b6" ON "CategoryService" ("company_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_25ac5a402836b4b0420c7747bf" ON "Client" ("company_id") `);
        await queryRunner.query(`ALTER TABLE "CategoryService" ADD CONSTRAINT "FK_7e28a3e2e70c4c47f518ac21b62" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CompanyWhatsappSetting" ADD CONSTRAINT "FK_f747ac91b0e98833a1d501eea0b" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CompanyPrompt" ADD CONSTRAINT "FK_4217c153d674e3ac353302c3034" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Client" ADD CONSTRAINT "FK_25ac5a402836b4b0420c7747bfa" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Client" DROP CONSTRAINT "FK_25ac5a402836b4b0420c7747bfa"`);
        await queryRunner.query(`ALTER TABLE "CompanyPrompt" DROP CONSTRAINT "FK_4217c153d674e3ac353302c3034"`);
        await queryRunner.query(`ALTER TABLE "CompanyWhatsappSetting" DROP CONSTRAINT "FK_f747ac91b0e98833a1d501eea0b"`);
        await queryRunner.query(`ALTER TABLE "CategoryService" DROP CONSTRAINT "FK_7e28a3e2e70c4c47f518ac21b62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25ac5a402836b4b0420c7747bf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e28a3e2e70c4c47f518ac21b6"`);
        await queryRunner.query(`ALTER TABLE "Client" DROP COLUMN "company_id"`);
        await queryRunner.query(`ALTER TABLE "CategoryService" DROP COLUMN "company_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4217c153d674e3ac353302c303"`);
        await queryRunner.query(`DROP TABLE "CompanyPrompt"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f747ac91b0e98833a1d501eea0"`);
        await queryRunner.query(`DROP TABLE "CompanyWhatsappSetting"`);
    }

}
