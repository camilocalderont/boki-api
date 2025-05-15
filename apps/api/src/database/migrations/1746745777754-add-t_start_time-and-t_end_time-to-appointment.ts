import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTStartTimeAndTEndTimeToAppointment1746745777754 implements MigrationInterface {
    name = 'AddTStartTimeAndTEndTimeToAppointment1746745777754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "t_time"`);
        await queryRunner.query(`ALTER TABLE "Appointment" ADD "t_start_time" TIME`);
        await queryRunner.query(`ALTER TABLE "Appointment" ADD "t_end_time" TIME`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Appointment" ADD "t_time" TIME`);
        
        await queryRunner.query(`UPDATE "Appointment" SET "t_start_time" = '00:00:00' WHERE "t_start_time" IS NULL`);
        
        await queryRunner.query(`UPDATE "Appointment" SET "t_time" = "t_start_time"`);
        
        await queryRunner.query(`UPDATE "Appointment" SET "t_time" = '00:00:00' WHERE "t_time" IS NULL`);
        
        await queryRunner.query(`ALTER TABLE "Appointment" ALTER COLUMN "t_time" SET NOT NULL`);
        
        await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "t_end_time"`);
        await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "t_start_time"`);
    }

}
