import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';
import { CompanyFlowStepEntity } from './companyFlowStep.entity';
import { CompanyFlowConditionEntity } from './companyFlowCondition.entity';
import { CompanyFlowToolEntity } from './companyFlowTool.entity';

@Entity('CompanyFlowDefinition')
export class CompanyFlowDefinitionEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'company_id', type: 'int' })
    CompanyId: number;

    @Column({ name: 'vc_flow_name', type: 'varchar', length: 100 })
    VcFlowName: string;

    @Column({ name: 'vc_display_name', type: 'varchar', length: 150 })
    VcDisplayName: string;

    @Column({ name: 'vc_description', type: 'text', nullable: true })
    VcDescription: string;   

    @Column({ name: 'tx_system_prompt', type: 'text' })
    TxSystemPrompt: string;

    @Column({ name: 'tx_user_prompt_template', type: 'text' })
    TxUserPromptTemplate: string;

    @Column({ name: 'json_flow_config', type: 'jsonb' })
    JsonFlowConfig: {
        max_steps?: number;
        timeout_minutes?:number;
        fallback_enabled?:boolean;
        auto_advance?:boolean;
        required_fields?:string[];
    };

    @Column({ name: 'json_llm_config', type: 'jsonb' })
    JsonLLMConfig: {
        model: string;
        temperature: number;
        max_tokens: number;
        top_p?: number;
        personality?: string;
        language?: string;
        custom_instructions?: string;
        fallback_model?: string;
    };

    @Column({ name: 'b_is_active', type: 'boolean', default: true })
    BIsActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => CompanyEntity, company => company.CompanyFlowDefinitions)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;

    @OneToMany(() => CompanyFlowStepEntity, step => step.FlowDefinition, { cascade: true })
    Steps: CompanyFlowStepEntity[];

    @OneToMany(() => CompanyFlowConditionEntity, condition => condition.FlowDefinition, { cascade: true })
    Conditions: CompanyFlowConditionEntity[];

    @OneToMany(() => CompanyFlowToolEntity, tool => tool.FlowDefinition, { cascade: true })
    Tools: CompanyFlowToolEntity[];

}
