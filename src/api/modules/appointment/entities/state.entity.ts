import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AppointmentStateEntity } from './appointmentState.entity';
import { AppointmentEntity } from './appointment.entity';

@Entity('State')
export class StateEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'vc_name', type: 'varchar', length: 100 })
    VcName: string;

    @OneToMany(() => AppointmentStateEntity, appointmentState => appointmentState.State)
    AppointmentStates: AppointmentStateEntity[];

    @OneToMany(() => AppointmentEntity, appointment => appointment.CurrentState)
    Appointments: AppointmentEntity[];

    @CreateDateColumn({ name: 'dt_created_at' })
    DtCreatedAt: Date;

    @UpdateDateColumn({ name: 'dt_updated_at' })
    DtUpdatedAt: Date;
}
