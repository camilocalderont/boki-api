import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AppointmentStageEntity } from './appointmentStage.entity';
import { AppointmentStateEntity } from './appointmentState.entity';
import { StateEntity } from './state.entity';
import { ClientEntity } from '../../client/entities/client.entity';
import { ServiceEntity } from '../../service/entities/service.entity';
import { ProfessionalEntity } from '../../professional/entities/professional.entity';

@Entity('Appointment')
export class AppointmentEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'client_id', type: 'integer' })
    ClientId: number;

    @ManyToOne(() => ClientEntity)
    @JoinColumn({ name: 'client_id' })
    Client: ClientEntity;

    @Column({ name: 'service_id', type: 'integer' })
    ServiceId: number;

    @ManyToOne(() => ServiceEntity)
    @JoinColumn({ name: 'service_id' })
    Service: ServiceEntity;

    @Column({ name: 'professional_id', type: 'integer' })
    ProfessionalId: number;

    @ManyToOne(() => ProfessionalEntity)
    @JoinColumn({ name: 'professional_id' })
    Professional: ProfessionalEntity;

    @Column({ name: 'dt_date', type: 'timestamp' })
    DtDate: Date;

    @Column({ name: 't_start_time', type: 'time', nullable: true })
    TStartTime: string;

    @Column({ name: 't_end_time', type: 'time', nullable: true })
    TEndTime: string;

    @Column({ name: 'current_state_id', type: 'integer' })
    CurrentStateId: number;

    @ManyToOne(() => StateEntity)
    @JoinColumn({ name: 'current_state_id' })
    CurrentState: StateEntity;

    @Column({ name: 'b_is_completed', type: 'boolean' })
    BIsCompleted: boolean;

    @Column({ name: 'b_is_absent', type: 'boolean' })
    BIsAbsent: boolean;

    @OneToMany(() => AppointmentStageEntity, appointmentStage => appointmentStage.Appointment)
    AppointmentStages: AppointmentStageEntity[];

    @OneToMany(() => AppointmentStateEntity, appointmentState => appointmentState.Appointment)
    AppointmentStates: AppointmentStateEntity[];

    @CreateDateColumn({ name: 'dt_created_at' })
    DtCreatedAt: Date;

    @UpdateDateColumn({ name: 'dt_updated_at' })
    DtUpdatedAt: Date;
}
