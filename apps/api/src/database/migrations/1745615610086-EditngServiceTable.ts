import { MigrationInterface, QueryRunner } from "typeorm";

export class EditngServiceTable1745615610086 implements MigrationInterface {
    name = 'EditngServiceTable1745615610086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Service" ADD "tx_picture" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Service" DROP COLUMN "tx_picture"`);
    }

}
