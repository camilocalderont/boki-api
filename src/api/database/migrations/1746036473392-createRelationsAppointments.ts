import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRelationsAppointments1746036473392 implements MigrationInterface {
    name = 'CreateRelationsAppointments1746036473392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Appointment" ADD CONSTRAINT "FK_097b4234ba0973ccbe7b6ab8c43" FOREIGN KEY ("service_id") REFERENCES "Service"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Appointment" ADD CONSTRAINT "FK_71608ffca193b116dfadd666182" FOREIGN KEY ("professional_id") REFERENCES "Professional"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Appointment" DROP CONSTRAINT "FK_71608ffca193b116dfadd666182"`);
        await queryRunner.query(`ALTER TABLE "Appointment" DROP CONSTRAINT "FK_097b4234ba0973ccbe7b6ab8c43"`);
    }

}
