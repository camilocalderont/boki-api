import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoryServiceIsService1746292363000 implements MigrationInterface {
    name = 'UpdateCategoryServiceIsService1746292363000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CategoryService" ADD "b_is_service" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CategoryService" DROP COLUMN "b_is_service"`);
    }

}
