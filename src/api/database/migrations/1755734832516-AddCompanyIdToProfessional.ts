import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyIdToProfessional1755734832516 implements MigrationInterface {
    name = 'AddCompanyIdToProfessional1755656208743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Professional" ADD COLUMN "company_id" integer NOT NULL DEFAULT 1`);

        await queryRunner.query(`ALTER TABLE "Professional" ADD CONSTRAINT "FK_Professional_Company" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`CREATE INDEX "IDX_Professional_company_id" ON "Professional" ("company_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_Professional_company_id"`);

        await queryRunner.query(`ALTER TABLE "Professional" DROP CONSTRAINT "FK_Professional_Company"`);
        
        await queryRunner.query(`ALTER TABLE "Professional" DROP COLUMN "company_id"`);
    }
}
