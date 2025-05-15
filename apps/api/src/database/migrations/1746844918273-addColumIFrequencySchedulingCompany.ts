import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumIFrequencySchedulingCompany1746844918273 implements MigrationInterface {
    name = 'AddColumIFrequencySchedulingCompany1746844918273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Company" ADD "i_frequency_scheduling" integer NOT NULL DEFAULT '10'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Company" DROP COLUMN "i_frequency_scheduling"`);
    }

}
