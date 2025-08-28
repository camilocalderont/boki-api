import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatTables1756343944319 implements MigrationInterface {
    name = 'CreateChatTables1756343944319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear las tablas de chat
        await queryRunner.query(`CREATE TABLE "Session" ("Id" SERIAL NOT NULL, "vc_session_id" character varying(255) NOT NULL, "vc_step" character varying(100), "vc_phone" character varying(20) NOT NULL, "vc_workflow_id" character varying(255), "vc_process_id" character varying(255), "dt_created_at" TIMESTAMP NOT NULL DEFAULT now(), "dt_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_162b59ba3ce72d71ff6a6998d5d" UNIQUE ("vc_session_id"), CONSTRAINT "PK_51787e551c9fc623831c466ac99" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "History" ("Id" SERIAL NOT NULL, "vc_session_id" character varying(255) NOT NULL, "vc_step" character varying(100), "dt_created_at" TIMESTAMP NOT NULL DEFAULT now(), "dt_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93e7b2ca264ba1503ce311bcec2" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a2b7acd260b47a6f1d49b27a84" ON "History" ("vc_session_id") `);
        await queryRunner.query(`CREATE TABLE "MessageHistory" ("Id" SERIAL NOT NULL, "vc_session_id" character varying(255) NOT NULL, "vc_user_name" character varying(100), "vc_message" text NOT NULL, "dt_created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_736803f781bc1e6acb98271db72" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5672868b1e20bcfd557ebda39d" ON "MessageHistory" ("vc_session_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar las tablas de chat en orden inverso
        await queryRunner.query(`DROP INDEX "public"."IDX_5672868b1e20bcfd557ebda39d"`);
        await queryRunner.query(`DROP TABLE "MessageHistory"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a2b7acd260b47a6f1d49b27a84"`);
        await queryRunner.query(`DROP TABLE "History"`);
        await queryRunner.query(`DROP TABLE "Session"`);
    }

}
