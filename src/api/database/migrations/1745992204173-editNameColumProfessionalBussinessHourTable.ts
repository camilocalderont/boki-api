import { MigrationInterface, QueryRunner } from "typeorm";

export class EditNameColumProfessionalBussinessHourTable1745992204173 implements MigrationInterface {
    name = 'EditNameColumProfessionalBussinessHourTable1745992204173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP COLUMN "day_of_week"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP COLUMN "break_start_time"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP COLUMN "break_end_time"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD "i_day_of_week" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD "t_start_time" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD "t_end_time" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD "t_break_start_time" TIME`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD "t_break_end_time" TIME`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP COLUMN "t_break_end_time"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP COLUMN "t_break_start_time"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP COLUMN "t_end_time"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP COLUMN "t_start_time"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP COLUMN "i_day_of_week"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD "break_end_time" TIME`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD "break_start_time" TIME`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD "end_time" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD "start_time" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD "day_of_week" integer NOT NULL`);
    }

}
