import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyPlanEntity } from '../../companyPlan/entities/companyPlan.entity';

@Entity('CompanyPlanControlToken')
export class CompanyPlanControlTokenEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'company_plan_id', type: 'int' })
    CompanyPlanId: number;

    @Column({ name: 'i_year', type: 'int' })
    IYear: number;

    @Column({ name: 'i_month', type: 'int' })
    IMonth: number;

    @Column({ name: 'i_max_interaction_tokens', type: 'int' })
    IMaxInteractionTokens: number;

    @Column({ name: 'i_max_conversation_tokens', type: 'int' })
    IMaxConversationTokens: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Relaciones
    @ManyToOne(() => CompanyPlanEntity, companyPlan => companyPlan.CompanyPlanControlTokens)
    @JoinColumn({ name: 'company_plan_id' })
    CompanyPlan: CompanyPlanEntity;
}