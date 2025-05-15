import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompanyBlockedTimeTable1746004598786 implements MigrationInterface {
    name = 'CreateCompanyBlockedTimeTable1746004598786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CompanyBlockedTime" ("Id" SERIAL NOT NULL, "company_id" integer NOT NULL, "dt_init_date" TIMESTAMP NOT NULL, "dt_end_date" TIMESTAMP NOT NULL, "vc_message" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "companyId" integer, CONSTRAINT "PK_a209f23c5a94eed0bc274deb078" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "CompanyBlockedTime" ADD CONSTRAINT "FK_16f2f1934807d7b0c93be6d1d20" FOREIGN KEY ("companyId") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CompanyBlockedTime" DROP CONSTRAINT "FK_16f2f1934807d7b0c93be6d1d20"`);
        await queryRunner.query(`DROP TABLE "CompanyBlockedTime"`);
    }

}
