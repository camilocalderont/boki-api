import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompanyFlowDefinition1754514966746 implements MigrationInterface {
    name = 'CreateCompanyFlowDefinition1754514966746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "CompanyFlowStep" ("Id" SERIAL NOT NULL, "flow_definition_id" integer NOT NULL, "vc_step_key" character varying(100) NOT NULL, "vc_step_name" character varying(150) NOT NULL, "i_step_order" integer NOT NULL, "tx_execution_condition" text NOT NULL, "tx_step_output" text NOT NULL, "json_expected_data" jsonb, "json_step_config" jsonb, "b_is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_304d288a34765b868265c15abb7" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_59abd61d319b6ab05c0298724a" ON "CompanyFlowStep" ("flow_definition_id") `);
        await queryRunner.query(`CREATE TABLE "CompanyFlowCondition" ("Id" SERIAL NOT NULL, "flow_definition_id" integer NOT NULL, "vc_condition_key" character varying(100) NOT NULL, "vc_condition_name" character varying(150) NOT NULL, "tx_condition_expression" text NOT NULL, "vc_condition_type" character varying(50) NOT NULL DEFAULT 'computed', "b_is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_648d5dd50945ab9c289ce0bc508" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a63bc8fc549be57aaf85321679" ON "CompanyFlowCondition" ("flow_definition_id") `);
        await queryRunner.query(`CREATE TABLE "CompanyFlowTool" ("Id" SERIAL NOT NULL, "flow_definition_id" integer NOT NULL, "vc_tool_type" character varying(100) NOT NULL, "vc_tool_name" character varying(150) NOT NULL, "json_tool_config" jsonb NOT NULL, "tx_usage_condition" text, "b_is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_55a275685913ac1d5836b3e215a" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9299ece6d54f6e1934445c7827" ON "CompanyFlowTool" ("flow_definition_id") `);
        await queryRunner.query(`CREATE TABLE "CompanyFlowDefinition" ("Id" SERIAL NOT NULL, "company_id" integer NOT NULL, "vc_flow_name" character varying(100) NOT NULL, "vc_display_name" character varying(150) NOT NULL, "vc_description" text, "tx_system_prompt" text NOT NULL, "tx_user_prompt_template" text NOT NULL, "json_flow_config" jsonb NOT NULL, "json_llm_config" jsonb NOT NULL, "b_is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7adcbac95906ee879a2aed24518" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a40361781e247894b5cf0fe5b8" ON "CompanyFlowDefinition" ("company_id") `);
        await queryRunner.query(`ALTER TABLE "CompanyFlowStep" ADD CONSTRAINT "FK_59abd61d319b6ab05c0298724a5" FOREIGN KEY ("flow_definition_id") REFERENCES "CompanyFlowDefinition"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CompanyFlowCondition" ADD CONSTRAINT "FK_a63bc8fc549be57aaf853216793" FOREIGN KEY ("flow_definition_id") REFERENCES "CompanyFlowDefinition"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CompanyFlowTool" ADD CONSTRAINT "FK_9299ece6d54f6e1934445c7827d" FOREIGN KEY ("flow_definition_id") REFERENCES "CompanyFlowDefinition"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CompanyFlowDefinition" ADD CONSTRAINT "FK_a40361781e247894b5cf0fe5b8f" FOREIGN KEY ("company_id") REFERENCES "Company"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CompanyFlowDefinition" DROP CONSTRAINT "FK_a40361781e247894b5cf0fe5b8f"`);
        await queryRunner.query(`ALTER TABLE "CompanyFlowTool" DROP CONSTRAINT "FK_9299ece6d54f6e1934445c7827d"`);
        await queryRunner.query(`ALTER TABLE "CompanyFlowCondition" DROP CONSTRAINT "FK_a63bc8fc549be57aaf853216793"`);
        await queryRunner.query(`ALTER TABLE "CompanyFlowStep" DROP CONSTRAINT "FK_59abd61d319b6ab05c0298724a5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a40361781e247894b5cf0fe5b8"`);
        await queryRunner.query(`DROP TABLE "CompanyFlowDefinition"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9299ece6d54f6e1934445c7827"`);
        await queryRunner.query(`DROP TABLE "CompanyFlowTool"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a63bc8fc549be57aaf85321679"`);
        await queryRunner.query(`DROP TABLE "CompanyFlowCondition"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59abd61d319b6ab05c0298724a"`);
        await queryRunner.query(`DROP TABLE "CompanyFlowStep"`);
    }

}
