import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('History')
export class HistoryEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'vc_session_id', type: 'varchar', length: 255 })
    VcSessionId: string;

    @Column({ name: 'vc_step', type: 'varchar', length: 100, nullable: true })
    VcStep?: string;

    @CreateDateColumn({ name: 'dt_created_at' })
    DtCreatedAt: Date;

    @UpdateDateColumn({ name: 'dt_updated_at' })
    DtUpdatedAt: Date;
}
