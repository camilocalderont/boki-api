import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity('CompanyPrompts')
export class CompanyPromptsEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'company_id', type: 'int' })
    CompanyId: number;

    @Column({ name: 'vc_description', type: 'varchar', length: 255 })
    VcDescription: string;

    @Column({ name: 'vc_internal_code', type: 'varchar', length: 100 })
    VcInternalCode: string;

    @Column({ name: 'tx_intention_prompt', type: 'text' })
    TxIntentionPrompt: string;

    @Column({ name: 'tx_main_prompt', type: 'text' })
    TxMainPrompt: string;

    @Column({ name: 'user_id', type: 'int' })
    UserId: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Relaciones
    @ManyToOne(() => CompanyEntity, company => company.CompanyPrompts)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;

    @ManyToOne(() => UsersEntity, user => user.CompanyPrompts)
    @JoinColumn({ name: 'user_id' })
    User: UsersEntity;
}