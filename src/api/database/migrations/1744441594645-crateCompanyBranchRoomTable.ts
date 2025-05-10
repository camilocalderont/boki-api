import { MigrationInterface, QueryRunner } from "typeorm";

export class CrateCompanyBranchRoomTable1744441594645 implements MigrationInterface {
    name = 'CrateCompanyBranchRoomTable1744441594645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CompanyBranchRoom" ("Id" SERIAL NOT NULL, "vc_number" character varying(100) NOT NULL, "vc_floor" character varying(100), "vc_tower" character varying(100), "vc_phone" character varying(20), "vc_email" character varying(100), "b_is_main" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_branch_id" integer, CONSTRAINT "PK_c68b937f4d6b324f411880f2b5a" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "CompanyBranchRoom" ADD CONSTRAINT "FK_cecb89538f149f693b771c71a71" FOREIGN KEY ("company_branch_id") REFERENCES "CompanyBranch"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CompanyBranchRoom" DROP CONSTRAINT "FK_cecb89538f149f693b771c71a71"`);
        await queryRunner.query(`DROP TABLE "CompanyBranchRoom"`);
    }

}
