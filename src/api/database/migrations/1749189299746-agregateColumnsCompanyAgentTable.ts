import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregateColumnsCompanyAgentTable1749189299746 implements MigrationInterface {
    name = 'AgregateColumnsCompanyAgentTable1749189299746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "vc_model_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "vc_repo_id" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "vc_filename" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "vc_local_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "dc_temperature" numeric(3,2) NOT NULL DEFAULT '0.1'`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "i_max_tokens" integer NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "dc_top_p" numeric(3,2) NOT NULL DEFAULT '0.8'`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "i_top_k" integer NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "i_context_length" integer NOT NULL DEFAULT '1024'`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "tx_stop_tokens" text`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "i_max_memory_mb" integer NOT NULL DEFAULT '6000'`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "i_n_threads" integer NOT NULL DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" ADD "bls_use_gpu" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "bls_use_gpu"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "i_n_threads"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "i_max_memory_mb"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "tx_stop_tokens"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "i_context_length"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "i_top_k"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "dc_top_p"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "i_max_tokens"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "dc_temperature"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "vc_local_name"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "vc_filename"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "vc_repo_id"`);
        await queryRunner.query(`ALTER TABLE "CompanyAgent" DROP COLUMN "vc_model_name"`);
    }

}
