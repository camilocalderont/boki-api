import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AppointmentEntity } from './appointment.entity';

@Entity('AppointmentStage')
export class AppointmentStageEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'appointment_id', type: 'integer' })
    AppointmentId: number;

    @ManyToOne(() => AppointmentEntity, appointment => appointment.AppointmentStages)
    @JoinColumn({ name: 'appointment_id' })
    Appointment: AppointmentEntity;

    @Column({ name: 'service_stage_id', type: 'integer' })
    ServiceStageId: number;

    @Column({ name: 'start_date_time', type: 'timestamp' })
    StartDateTime: Date;

    @Column({ name: 'end_date_time', type: 'timestamp' })
    EndDateTime: Date;

    @Column({ name: 'bls_professional_busy', type: 'boolean' })
    BlsProfessionalBusy: boolean;

    @CreateDateColumn({ name: 'dt_created_at' })
    DtCreatedAt: Date;

    @UpdateDateColumn({ name: 'dt_updated_at' })
    DtUpdatedAt: Date;
}
