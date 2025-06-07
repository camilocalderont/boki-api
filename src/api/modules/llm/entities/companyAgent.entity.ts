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

    // Configuración del modelo
    @Column({ name: 'vc_model_name', type: 'varchar', length: 100, nullable: true })
    VcModelName: string;

    @Column({ name: 'vc_repo_id', type: 'varchar', length: 200, nullable: true })
    VcRepoId: string;

    @Column({ name: 'vc_filename', type: 'varchar', length: 200, nullable: true })
    VcFilename: string;

    @Column({ name: 'vc_local_name', type: 'varchar', length: 100, nullable: true })
    VcLocalName: string;

    // Parámetros del LLM
    @Column({ name: 'dc_temperature', type: 'decimal', precision: 3, scale: 2, default: 0.1 })
    DcTemperature: number;

    @Column({ name: 'i_max_tokens', type: 'int', default: 100 })
    IMaxTokens: number;

    @Column({ name: 'dc_top_p', type: 'decimal', precision: 3, scale: 2, default: 0.8 })
    DcTopP: number;

    @Column({ name: 'i_top_k', type: 'int', default: 5 })
    ITopK: number;

    @Column({ name: 'i_context_length', type: 'int', default: 1024 })
    IContextLength: number;

    @Column({ name: 'tx_stop_tokens', type: 'text', nullable: true })
    TxStopTokens: string;

    // Hardware
    @Column({ name: 'i_max_memory_mb', type: 'int', default: 6000 })
    IMaxMemoryMb: number;

    @Column({ name: 'i_n_threads', type: 'int', default: 2 })
    INThreads: number;

    @Column({ name: 'bls_use_gpu', type: 'boolean', default: false })
    BlsUseGpu: boolean;
    
    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => CompanyEntity, company => company.CompanyAgents)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;

}
