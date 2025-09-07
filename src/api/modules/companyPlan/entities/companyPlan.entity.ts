import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';
import { PlanEntity } from '../../plan/entities/plan.entity';
import { CompanyPlanControlTokenEntity } from '../../companyPlanControlToken/entities/companyPlanControlToken.entity';

@Entity('CompanyPlan')
export class CompanyPlanEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'company_id', type: 'int' })
    CompanyId: number;

    @Column({ name: 'plan_id', type: 'int' })
    PlanId: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Relaciones
    @ManyToOne(() => CompanyEntity, company => company.CompanyPlans)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;

    @ManyToOne(() => PlanEntity, plan => plan.CompanyPlans)
    @JoinColumn({ name: 'plan_id' })
    Plan: PlanEntity;

    @OneToMany(() => CompanyPlanControlTokenEntity, controlToken => controlToken.CompanyPlan)
    CompanyPlanControlTokens: CompanyPlanControlTokenEntity[];
}