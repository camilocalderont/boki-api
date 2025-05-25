import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AppointmentEntity } from '../../appointment/entities/appointment.entity';

@Entity('Client')
export class ClientEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'vc_identification_number', type: 'varchar', length: 50 })
    VcIdentificationNumber: string;

    @Column({ name: 'vc_phone', type: 'varchar', length: 20})
    VcPhone?: string;

    @Column({ name: 'vc_nick_name', type: 'varchar', length: 50, nullable: true })
    VcNickName?: string;

    @Column({ name: 'vc_first_name', type: 'varchar', length: 50 })
    VcFirstName: string;

    @Column({ name: 'vc_second_name', type: 'varchar', length: 50, nullable: true })
    VcSecondName?: string;

    @Column({ name: 'vc_first_last_name', type: 'varchar', length: 50, nullable: true })
    VcFirstLastName: string;

    @Column({ name: 'vc_second_last_name', type: 'varchar', length: 50, nullable: true })
    VcSecondLastName?: string;

    @Column({ name: 'vc_email', type: 'varchar', length: 100, unique: true, nullable: true })
    VcEmail: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @OneToMany(() => AppointmentEntity, appointment => appointment.Client)
    Appointments: AppointmentEntity[];
}
