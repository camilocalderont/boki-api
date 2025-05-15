import { MigrationInterface, QueryRunner } from "typeorm";

export class EditrelationsTables1746001875706 implements MigrationInterface {
    name = 'EditrelationsTables1746001875706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_74b50b86c3579c9887dc070756" ON "ProfessionalBussinessHour" ("professional_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1f5a2c30310a51bb1d28463a32" ON "ProfessionalBussinessHour" ("company_branch_room_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6dc401eb2310729cde3b486bc3" ON "Service" ("company_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bb6a3a8c929d83f5b9aaaa8797" ON "Service" ("category_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bb6a3a8c929d83f5b9aaaa8797"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6dc401eb2310729cde3b486bc3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f5a2c30310a51bb1d28463a32"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74b50b86c3579c9887dc070756"`);
    }

}
