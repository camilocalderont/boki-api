import { MigrationInterface, QueryRunner } from "typeorm";

export class CrateCategoryServiceTable1744060881205 implements MigrationInterface {
    name = 'CrateCategoryServiceTable1744060881205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CategoryService" ("Id" SERIAL NOT NULL, "vc_name" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ea0b2c34f30b8e19d244d00a12b" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "CategoryService"`);
    }

}
