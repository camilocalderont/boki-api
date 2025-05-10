import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Entity('CompanyBlockedTime')
export class CompanyBlockedTimeEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'company_id', type: 'integer' })
    CompanyId: number;

    @Column({ name: 'dt_init_date', type: 'timestamp' })
    DtInitDate: Date;

    @Column({ name: 'dt_end_date', type: 'timestamp' })
    DtEndDate: Date;

    @Column({ name: 'vc_message', type: 'varchar', length: 255, nullable: true })
    VcMessage?: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => CompanyEntity, company => company.CompanyBlockedTimes)
    Company: CompanyEntity;
}
