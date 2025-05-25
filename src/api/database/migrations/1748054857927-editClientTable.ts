import { MigrationInterface, QueryRunner } from "typeorm";

export class EditClientTable1748054857927 implements MigrationInterface {
    name = 'EditClientTable1748054857927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Client" ALTER COLUMN "vc_phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Client" ALTER COLUMN "vc_first_last_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Client" ALTER COLUMN "vc_email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Client" ALTER COLUMN "vc_email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Client" ALTER COLUMN "vc_first_last_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Client" ALTER COLUMN "vc_phone" DROP NOT NULL`);
    }

}
