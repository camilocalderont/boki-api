import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ServiceEntity } from './service.entity';

@Entity('ServiceStage')
export class ServiceStageEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'service_id', type: 'int' })
    ServiceId: number;

    @Column({ name: 'i_sequence', type: 'int' })
    ISequence: number;

    @Column({ name: 'i_duration_minutes', type: 'int' })
    IDurationMinutes: number;

    @Column({ name: 'vc_description', type: 'varchar', length: 500, nullable: true })
    VcDescription: string;

    @Column({ name: 'b_is_professional_bussy', type: 'boolean', default: false })
    BIsProfessionalBussy: boolean;

    @Column({ name: 'b_is_active', type: 'boolean', default: true })
    BIsActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => ServiceEntity, service => service.ServiceStages)
    @JoinColumn({ name: 'service_id' })
    Service: ServiceEntity;
}
