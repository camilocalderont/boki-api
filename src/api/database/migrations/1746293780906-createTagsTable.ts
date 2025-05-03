import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTagsTable1746293780906 implements MigrationInterface {
    name = 'CreateTagsTable1746293780906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Tags" ("Id" SERIAL NOT NULL, "vc_name" character varying(250) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7373f792b1d37d5363528a62da" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Tags"`);
    }

}
