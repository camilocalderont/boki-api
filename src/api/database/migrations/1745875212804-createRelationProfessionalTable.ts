import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRelationProfessionalTable1745875212804 implements MigrationInterface {
    name = 'CreateRelationProfessionalTable1745875212804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ProfessionalService" ADD CONSTRAINT "FK_fc23bf8e6d21a77e827cbea2e39" FOREIGN KEY ("professional_id") REFERENCES "Professional"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProfessionalService" ADD CONSTRAINT "FK_f3f6a06c6c438efdb7de30a13e9" FOREIGN KEY ("service_id") REFERENCES "Service"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD CONSTRAINT "FK_74b50b86c3579c9887dc0707568" FOREIGN KEY ("professional_id") REFERENCES "Professional"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" ADD CONSTRAINT "FK_1f5a2c30310a51bb1d28463a32e" FOREIGN KEY ("company_branch_room_id") REFERENCES "CompanyBranchRoom"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP CONSTRAINT "FK_1f5a2c30310a51bb1d28463a32e"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalBussinessHour" DROP CONSTRAINT "FK_74b50b86c3579c9887dc0707568"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalService" DROP CONSTRAINT "FK_f3f6a06c6c438efdb7de30a13e9"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalService" DROP CONSTRAINT "FK_fc23bf8e6d21a77e827cbea2e39"`);
    }

}
