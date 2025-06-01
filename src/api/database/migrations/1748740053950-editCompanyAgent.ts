import { MigrationInterface, QueryRunner } from "typeorm";

export class EditCompanyAgent1748740053950 implements MigrationInterface {
    name = 'EditCompanyAgent1748740053950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CompanyAgent" ("Id" SERIAL NOT NULL, "company_id" integer NOT NULL, "vc_agent_name" character varying(100) NOT NULL, "tx_prompt_template" text NOT NULL, "b_is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e7252991ca85d3414467605305e" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d355eb713a84a65ec4e4ddba3" ON "CompanyAgent" ("company_id") `);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD CONSTRAINT "FK_4d355eb713a84a65ec4e4ddba3d" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP CONSTRAINT "FK_4d355eb713a84a65ec4e4ddba3d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d355eb713a84a65ec4e4ddba3"`);
        await queryRunner.query(`DROP TABLE "CompanyAgent"`);
    }

}
