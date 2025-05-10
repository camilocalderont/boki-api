import { MigrationInterface, QueryRunner } from "typeorm";

export class EditClientTable1745998774499 implements MigrationInterface {
    name = 'EditClientTable1745998774499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Client" DROP COLUMN "vc_password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Client" ADD "vc_password" character varying(255)`);
        await queryRunner.query(`UPDATE "Client" SET "vc_password" = 'default_password'`);
        await queryRunner.query(`ALTER TABLE "Client" ALTER COLUMN "vc_password" SET NOT NULL`);
    }

}
