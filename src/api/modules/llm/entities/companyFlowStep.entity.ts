import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyFlowDefinitionEntity } from './companyFlowDefinition.entity';

@Entity('CompanyFlowStep')
export class CompanyFlowStepEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'flow_definition_id', type: 'int' })
    FlowDefinitionId: number;

    @Column({ name: 'vc_step_key', type: 'varchar', length: 100 })
    VcStepKey: string;

    @Column({ name: 'vc_step_name', type: 'varchar', length: 150 })
    VcStepName: string;

    @Column({ name: 'i_step_order', type: 'int' })
    IStepOrder: number;

    @Column({ name: 'tx_execution_condition', type: 'text' })
    TxExecutionCondition: string;

    @Column({ name: 'tx_step_output', type: 'text' })
    TxStepOutput: string;

    @Column({ name: 'json_expected_data', type: 'jsonb', nullable: true })
    JsonExpectedData: any;

    @Column({ name: 'json_step_config', type: 'jsonb', nullable: true })
    JsonStepConfig: any;

    @Column({ name: 'b_is_active', type: 'boolean', default: true })
    BIsActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => CompanyFlowDefinitionEntity, flow => flow.Steps)
    @JoinColumn({ name: 'flow_definition_id' })
    FlowDefinition: CompanyFlowDefinitionEntity;

}
