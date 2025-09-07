import { MigrationInterface, QueryRunner } from "typeorm";

export class CompanyPlan1757220119782 implements MigrationInterface {
    name = 'CompanyPlan1757220119782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CompanyPlan" (
            "Id" SERIAL NOT NULL, 
            "company_id" integer NOT NULL, 
            "plan_id" integer NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_CompanyPlan_Id" PRIMARY KEY ("Id")
        )`);
        
        await queryRunner.query(`ALTER TABLE "CompanyPlan" ADD CONSTRAINT "FK_CompanyPlan_Company" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
        await queryRunner.query(`ALTER TABLE "CompanyPlan" ADD CONSTRAINT "FK_CompanyPlan_Plan" FOREIGN KEY ("plan_id") REFERENCES "Plan"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CompanyPlan" DROP CONSTRAINT "FK_CompanyPlan_Plan"`);
        await queryRunner.query(`ALTER TABLE "CompanyPlan" DROP CONSTRAINT "FK_CompanyPlan_Company"`);
        await queryRunner.query(`DROP TABLE "CompanyPlan"`);
    }
}
