import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfessionalServiceTable1745873917464 implements MigrationInterface {
    name = 'CreateProfessionalServiceTable1745873917464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ProfessionalService" ("Id" SERIAL NOT NULL, "professional_id" integer NOT NULL, "service_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f81ce2c7be56264a205f90972fc" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ProfessionalService"`);
    }

}
