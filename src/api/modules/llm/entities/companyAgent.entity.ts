import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';

@Entity('CompanyAgent')
export class CompanyAgentEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'company_id', type: 'int' })
    CompanyId: number;

    @Column({ name: 'vc_agent_name', type: 'varchar', length: 100 })
    VcAgentName: string;

    @Column({ name: 'tx_prompt_template', type: 'text' })
    TxPromptTemplate: string;   

    @Column({ name: 'b_is_active', type: 'boolean', default: true })
    BIsActive: boolean;
    
    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => CompanyEntity, company => company.CompanyAgents)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;

}
