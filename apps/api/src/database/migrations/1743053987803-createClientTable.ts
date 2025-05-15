import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientTable1743053987803 implements MigrationInterface {
    name = 'CreateClientTable1743053987803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Client" ("Id" SERIAL NOT NULL, "vc_identification_number" character varying(50) NOT NULL, "vc_phone" character varying(20), "vc_nick_name" character varying(50), "vc_first_name" character varying(50) NOT NULL, "vc_second_name" character varying(50), "vc_first_last_name" character varying(50) NOT NULL, "vc_second_last_name" character varying(50), "vc_email" character varying(100) NOT NULL, "vc_password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fbaae4ddd5c279e264095671447" UNIQUE ("vc_email"), CONSTRAINT "PK_51f98d657b13699f2d3bf17c24d" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Client"`);
    }

}
