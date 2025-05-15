import { MigrationInterface, QueryRunner } from "typeorm";

export class CrateCompanyBranchTable1744054738262 implements MigrationInterface {
    name = 'CrateCompanyBranchTable1744054738262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CompanyBranch" ("Id" SERIAL NOT NULL, "company_id" integer NOT NULL, "vc_name" character varying(100) NOT NULL, "vc_description" character varying(255), "vc_address" character varying(150) NOT NULL, "vc_email" character varying(100) NOT NULL, "vc_phone" character varying(20), "vc_branch_manager_name" character varying(100), "vc_image" character varying(255), "b_is_principal" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57f11d40d7227a530ab1de45a5f" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "CompanyBranch" ADD CONSTRAINT "FK_0129812a3f83cd4b103b12d0e88" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CompanyBranch" DROP CONSTRAINT "FK_0129812a3f83cd4b103b12d0e88"`);
        await queryRunner.query(`DROP TABLE "CompanyBranch"`);
    }

}
