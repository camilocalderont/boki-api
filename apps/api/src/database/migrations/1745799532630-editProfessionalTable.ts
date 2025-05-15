import { MigrationInterface, QueryRunner } from "typeorm";

export class EditProfessionalTable1745799532630 implements MigrationInterface {
    name = 'EditProfessionalTable1745799532630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Professional" RENAME COLUMN "vc_photo" TO "tx_photo"`);
        await queryRunner.query(`ALTER TABLE "Professional" DROP COLUMN "tx_photo"`);
        await queryRunner.query(`ALTER TABLE "Professional" ADD "tx_photo" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Professional" DROP COLUMN "tx_photo"`);
        await queryRunner.query(`ALTER TABLE "Professional" ADD "tx_photo" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "Professional" RENAME COLUMN "tx_photo" TO "vc_photo"`);
    }

}
