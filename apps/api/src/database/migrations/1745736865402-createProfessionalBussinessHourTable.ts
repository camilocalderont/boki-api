import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProfessionalBussinessHourTable1745736865402 implements MigrationInterface {
    name = 'CreateProfessionalBussinessHourTable1745736865402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ProfessionalBussinessHour" ("Id" SERIAL NOT NULL, "professional_id" integer NOT NULL, "day_of_week" integer NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "break_start_time" TIME, "break_end_time" TIME, "vc_notes" character varying(255), "company_branch_room_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_45405fe3e02528d77e2e869d908" PRIMARY KEY ("Id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ProfessionalBussinessHour"`);
    }

}
