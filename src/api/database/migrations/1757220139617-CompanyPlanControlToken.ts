import { MigrationInterface, QueryRunner } from "typeorm";

export class CompanyPlanControlToken1757220139617 implements MigrationInterface {
    name = 'CompanyPlanControlToken1757220139617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CompanyPlanControlToken" (
            "Id" SERIAL NOT NULL, 
            "company_plan_id" integer NOT NULL, 
            "i_year" integer NOT NULL, 
            "i_month" integer NOT NULL, 
            "i_max_interaction_tokens" integer NOT NULL, 
            "i_max_conversation_tokens" integer NOT NULL, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_CompanyPlanControlToken_Id" PRIMARY KEY ("Id")
        )`);
        
        await queryRunner.query(`ALTER TABLE "CompanyPlanControlToken" ADD CONSTRAINT "FK_CompanyPlanControlToken_CompanyPlan" FOREIGN KEY ("company_plan_id") REFERENCES "CompanyPlan"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CompanyPlanControlToken" DROP CONSTRAINT "FK_CompanyPlanControlToken_CompanyPlan"`);
        await queryRunner.query(`DROP TABLE "CompanyPlanControlToken"`);
    }

}
