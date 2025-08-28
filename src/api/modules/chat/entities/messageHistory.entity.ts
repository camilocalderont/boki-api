import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('MessageHistory')
export class MessageHistoryEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'vc_session_id', type: 'varchar', length: 255 })
    VcSessionId: string;

    @Column({ name: 'vc_user_name', type: 'varchar', length: 100, nullable: true })
    VcUserName?: string;

    @Column({ name: 'vc_message', type: 'text' })
    VcMessage: string;

    @CreateDateColumn({ name: 'dt_created_at' })
    DtCreatedAt: Date;
}
