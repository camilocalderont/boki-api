import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTxPromptToCompany1756345980000 implements MigrationInterface {
    name = 'AddTxPromptToCompany1756345980000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Agregar columna tx_prompt a la tabla Company
        // Este campo se usa de manera general para casos sencillos que no requieren de flujos externos
        // y se hace para generar personalidad al bot
        await queryRunner.query(`ALTER TABLE "Company" ADD COLUMN "tx_prompt" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar columna tx_prompt
        await queryRunner.query(`ALTER TABLE "Company" DROP COLUMN "tx_prompt"`);
    }
}
