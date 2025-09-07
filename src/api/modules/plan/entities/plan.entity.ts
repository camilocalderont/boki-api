import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CompanyPlanEntity } from '../../companyPlan/entities/companyPlan.entity';


@Entity('Plan')
export class PlanEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'i_value_monthly', type: 'int' })
    IValueMonthly: number;

    @Column({ name: 'i_value_yearly', type: 'int' })
    IValueYearly: number;

    @Column({ name: 'i_time', type: 'int' })
    ITime: number;

    @Column({ name: 'i_max_conversation', type: 'int' })
    IMaxConversation: number;

    @Column({ name: 'tx_properties', type: 'text', nullable: true })
    TxProperties?: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Relaciones
    @OneToMany(() => CompanyPlanEntity, companyPlan => companyPlan.Plan)
    CompanyPlans: CompanyPlanEntity[];
}