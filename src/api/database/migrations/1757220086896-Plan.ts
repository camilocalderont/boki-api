import { MigrationInterface, QueryRunner } from "typeorm";

export class Plan1757220086896 implements MigrationInterface {
    name = 'Plan1757220086896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Plan" (
            "Id" SERIAL NOT NULL, 
            "i_value_monthly" integer NOT NULL, 
            "i_value_yearly" integer NOT NULL, 
            "i_time" integer NOT NULL, 
            "i_max_conversation" integer NOT NULL, 
            "tx_properties" text, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_Plan_Id" PRIMARY KEY ("Id")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Plan"`);
    }

}
