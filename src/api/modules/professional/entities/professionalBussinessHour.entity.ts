import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ProfessionalEntity } from './professional.entity';
import { CompanyBranchRoomEntity } from '../../companyBranch/entities/companyBranchRoom.entity';

@Entity('ProfessionalBussinessHour')
export class ProfessionalBussinessHourEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'professional_id', type: 'int' })
    ProfessionalId: number;

    @Column({ name: 'i_day_of_week', type: 'int' })
    IDayOfWeek: number;

    @Column({ name: 't_start_time', type: 'time' })
    TStartTime: Date;

    @Column({ name: 't_end_time', type: 'time' })
    TEndTime: Date;

    @Column({ name: 't_break_start_time', type: 'time', nullable: true })
    TBreakStartTime?: Date;

    @Column({ name: 't_break_end_time', type: 'time', nullable: true })
    TBreakEndTime?: Date;

    @Column({ name: 'vc_notes', type: 'varchar', length: 255, nullable: true })
    VcNotes?: string;

    @Index()
    @Column({ name: 'company_branch_room_id', type: 'int' })
    CompanyBranchRoomId: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => ProfessionalEntity, professional => professional.BussinessHours)
    @JoinColumn({ name: 'professional_id' })
    Professional: ProfessionalEntity;

    @ManyToOne(() => CompanyBranchRoomEntity)
    @JoinColumn({ name: 'company_branch_room_id' })
    CompanyBranchRoom: CompanyBranchRoomEntity;
}