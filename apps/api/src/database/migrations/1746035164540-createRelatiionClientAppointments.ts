import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRelatiionClientAppointments1746035164540 implements MigrationInterface {
    name = 'CreateRelatiionClientAppointments1746035164540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Appointment" ADD CONSTRAINT "FK_8325f09d832b701002bf43de055" FOREIGN KEY ("client_id") REFERENCES "Client"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Appointment" DROP CONSTRAINT "FK_8325f09d832b701002bf43de055"`);
    }

}
