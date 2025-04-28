import { MigrationInterface, QueryRunner } from "typeorm";

export class EditngCompanyTable1745625311305 implements MigrationInterface {
    name = 'EditngCompanyTable1745625311305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Company" RENAME COLUMN "vc_logo" TO "tx_logo"`);
        await queryRunner.query(`ALTER TABLE "Company" DROP COLUMN "tx_logo"`);
        await queryRunner.query(`ALTER TABLE "Company" ADD "tx_logo" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Company" DROP COLUMN "tx_logo"`);
        await queryRunner.query(`ALTER TABLE "Company" ADD "tx_logo" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "Company" RENAME COLUMN "tx_logo" TO "vc_logo"`);
    }

}
