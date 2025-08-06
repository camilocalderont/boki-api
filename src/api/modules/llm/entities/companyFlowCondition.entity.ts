import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyFlowDefinitionEntity } from './companyFlowDefinition.entity';

@Entity('CompanyFlowCondition')
export class CompanyFlowConditionEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'flow_definition_id', type: 'int' })
    FlowDefinitionId: number;

    @Column({ name: 'vc_condition_key', type: 'varchar', length: 100 })
    VcConditionKey: string;

    @Column({ name: 'vc_condition_name', type: 'varchar', length: 150 })
    VcConditionName: string;

    @Column({ name: 'tx_condition_expression', type: 'text' })
    TxConditionExpression: string;

    @Column({ name: 'vc_condition_type', type: 'varchar', length: 50, default: 'computed' })
    VcConditionType: string;

    @Column({ name: 'b_is_active', type: 'boolean', default: true })
    BIsActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @ManyToOne(() => CompanyFlowDefinitionEntity, flow => flow.Conditions)
    @JoinColumn({ name: 'flow_definition_id' })
    FlowDefinition: CompanyFlowDefinitionEntity;
}
