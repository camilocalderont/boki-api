import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToCompany1755656208742 implements MigrationInterface {
    name = 'AddUserIdToCompany1755656208742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Agregar columna user_id a la tabla Company existente
        await queryRunner.query(`ALTER TABLE "Company" ADD COLUMN "user_id" integer NOT NULL DEFAULT 1`);
        
        // Agregar foreign key constraint hacia Users
        await queryRunner.query(`ALTER TABLE "Company" ADD CONSTRAINT "FK_Company_User" FOREIGN KEY ("user_id") REFERENCES "Users"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar foreign key constraint
        await queryRunner.query(`ALTER TABLE "Company" DROP CONSTRAINT "FK_Company_User"`);
        
        // Eliminar columna user_id
        await queryRunner.query(`ALTER TABLE "Company" DROP COLUMN "user_id"`);
    }
}