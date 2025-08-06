import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyFlowDefinitionEntity } from './companyFlowDefinition.entity';

@Entity('CompanyFlowTool')
export class CompanyFlowToolEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'flow_definition_id', type: 'int' })
    FlowDefinitionId: number;

    @Column({ name: 'vc_tool_type', type: 'varchar', length: 100 })
    VcToolType: string;

    @Column({ name: 'vc_tool_name', type: 'varchar', length: 150 })
    VcToolName: string;

    @Column({ name: 'json_tool_config', type: 'jsonb' })
    JsonToolConfig: any;

    @Column({ name: 'tx_usage_condition', type: 'text', nullable: true })
    TxUsageCondition: string;

    @Column({ name: 'b_is_active', type: 'boolean', default: true })
    BIsActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @ManyToOne(() => CompanyFlowDefinitionEntity, flow => flow.Tools)
    @JoinColumn({ name: 'flow_definition_id' })
    FlowDefinition: CompanyFlowDefinitionEntity;
}
