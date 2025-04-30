import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServiceStageTable1746001512541 implements MigrationInterface {
    name = 'CreateServiceStageTable1746001512541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ServiceStage" ("Id" SERIAL NOT NULL, "service_id" integer NOT NULL, "i_sequence" integer NOT NULL, "i_duration_minutes" integer NOT NULL, "vc_description" character varying(500), "b_is_professional_bussy" boolean NOT NULL DEFAULT false, "b_is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2860c5b9d62ff35e8eedce9fe09" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9692b7a1b787acd335cdb3f858" ON "ServiceStage" ("service_id") `);
        await queryRunner.query(`ALTER TABLE "ServiceStage" ADD CONSTRAINT "FK_9692b7a1b787acd335cdb3f8584" FOREIGN KEY ("service_id") REFERENCES "Service"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ServiceStage" DROP CONSTRAINT "FK_9692b7a1b787acd335cdb3f8584"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9692b7a1b787acd335cdb3f858"`);
        await queryRunner.query(`DROP TABLE "ServiceStage"`);
    }

}
