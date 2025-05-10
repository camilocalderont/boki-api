import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1746000331036 implements MigrationInterface {
    name = 'CreateUsersTable1746000331036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Users" ("Id" SERIAL NOT NULL, "vc_identification_number" character varying(50) NOT NULL, "vc_phone" character varying(20), "vc_nick_name" character varying(50), "vc_first_name" character varying(50) NOT NULL, "vc_second_name" character varying(50), "vc_first_last_name" character varying(50) NOT NULL, "vc_second_last_name" character varying(50), "vc_email" character varying(100) NOT NULL, "vc_password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4cddfbb53f9b1e3e213848c0f08" UNIQUE ("vc_email"), CONSTRAINT "PK_329bb2946729a51bd2b19a5159f" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
