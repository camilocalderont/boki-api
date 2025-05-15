import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AppointmentEntity } from './appointment.entity';
import { StateEntity } from './state.entity';

@Entity('AppointmentState')
export class AppointmentStateEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'appointment_id', type: 'integer' })
    AppointmentId: number;

    @ManyToOne(() => AppointmentEntity, appointment => appointment.AppointmentStates)
    @JoinColumn({ name: 'appointment_id' })
    Appointment: AppointmentEntity;

    @Column({ name: 'state_id', type: 'integer' })
    StateId: number;

    @ManyToOne(() => StateEntity)
    @JoinColumn({ name: 'state_id' })
    State: StateEntity;

    @Column({ name: 'vc_changed_by', type: 'varchar', length: 100 })
    VcChangedBy: string;

    @Column({ name: 'vc_reason', type: 'varchar', length: 255, nullable: true })
    VcReason?: string;

    @Column({ name: 'dt_date_time', type: 'timestamp' })
    DtDateTime: Date;

    @Column({ name: 'dt_previous_date', type: 'date', nullable: true })
    DtPreviousDate?: Date;

    @Column({ name: 'tprevious_time', type: 'time', nullable: true })
    TPreviousTime?: string;

    @Column({ name: 'dt_current_date', type: 'date', nullable: true })
    DtCurrentDate?: Date;

    @Column({ name: 'tcurrent_time', type: 'time', nullable: true })
    TCurrentTime?: string;

    @CreateDateColumn({ name: 'dt_created_at' })
    DtCreatedAt: Date;

    @UpdateDateColumn({ name: 'dt_updated_at' })
    DtUpdatedAt: Date;
}
