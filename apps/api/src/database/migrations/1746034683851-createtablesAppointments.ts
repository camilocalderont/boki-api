import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatetablesAppointments1746034683851 implements MigrationInterface {
    name = 'CreatetablesAppointments1746034683851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "AppointmentStage" ("Id" SERIAL NOT NULL, "appointment_id" integer NOT NULL, "service_stage_id" integer NOT NULL, "start_date_time" TIMESTAMP NOT NULL, "end_date_time" TIMESTAMP NOT NULL, "bls_professional_busy" boolean NOT NULL, "dt_created_at" TIMESTAMP NOT NULL DEFAULT now(), "dt_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d5c3cf07f90b6a5110bc306b81" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "Appointment" ("Id" SERIAL NOT NULL, "client_id" integer NOT NULL, "service_id" integer NOT NULL, "professional_id" integer NOT NULL, "dt_date" TIMESTAMP NOT NULL, "t_time" TIME NOT NULL, "current_state_id" integer NOT NULL, "b_is_completed" boolean NOT NULL, "b_is_absent" boolean NOT NULL, "dt_created_at" TIMESTAMP NOT NULL DEFAULT now(), "dt_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a237ec8f5a04b61cd9701d25091" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "AppointmentState" ("Id" SERIAL NOT NULL, "appointment_id" integer NOT NULL, "state_id" integer NOT NULL, "vc_changed_by" character varying(100) NOT NULL, "vc_reason" character varying(255), "dt_date_time" TIMESTAMP NOT NULL, "dt_previous_date" date, "tprevious_time" TIME, "dt_current_date" date, "tcurrent_time" TIME, "dt_created_at" TIMESTAMP NOT NULL DEFAULT now(), "dt_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9308f53a826cbd901039866ca4e" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "State" ("Id" SERIAL NOT NULL, "vc_name" character varying(100) NOT NULL, "dt_created_at" TIMESTAMP NOT NULL DEFAULT now(), "dt_updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc25345de2e5c644985958e4d" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "AppointmentStage" ADD CONSTRAINT "FK_a6499d39d13202387f4b8ec097b" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Appointment" ADD CONSTRAINT "FK_5a088276a547c1046e7feadc604" FOREIGN KEY ("current_state_id") REFERENCES "State"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AppointmentState" ADD CONSTRAINT "FK_8541116878714668095c3eb97d7" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AppointmentState" ADD CONSTRAINT "FK_b8d2d64c62bf0244e4d2bec1854" FOREIGN KEY ("state_id") REFERENCES "State"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AppointmentState" DROP CONSTRAINT "FK_b8d2d64c62bf0244e4d2bec1854"`);
        await queryRunner.query(`ALTER TABLE "AppointmentState" DROP CONSTRAINT "FK_8541116878714668095c3eb97d7"`);
        await queryRunner.query(`ALTER TABLE "Appointment" DROP CONSTRAINT "FK_5a088276a547c1046e7feadc604"`);
        await queryRunner.query(`ALTER TABLE "AppointmentStage" DROP CONSTRAINT "FK_a6499d39d13202387f4b8ec097b"`);
        await queryRunner.query(`DROP TABLE "State"`);
        await queryRunner.query(`DROP TABLE "AppointmentState"`);
        await queryRunner.query(`DROP TABLE "Appointment"`);
        await queryRunner.query(`DROP TABLE "AppointmentStage"`);
    }

}
