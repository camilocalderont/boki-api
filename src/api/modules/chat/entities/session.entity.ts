import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Session')
export class SessionEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'vc_session_id', type: 'varchar', length: 255, unique: true })
    VcSessionId: string;

    @Column({ name: 'vc_step', type: 'varchar', length: 100, nullable: true })
    VcStep?: string;

    @Column({ name: 'vc_phone', type: 'varchar', length: 20 })
    VcPhone: string;

    @Column({ name: 'vc_workflow_id', type: 'varchar', length: 255, nullable: true })
    VcWorkflowId?: string;

    @Column({ name: 'vc_process_id', type: 'varchar', length: 255, nullable: true })
    VcProcessId?: string;

    @CreateDateColumn({ name: 'dt_created_at' })
    DtCreatedAt: Date;

    @UpdateDateColumn({ name: 'dt_updated_at' })
    DtUpdatedAt: Date;
}
