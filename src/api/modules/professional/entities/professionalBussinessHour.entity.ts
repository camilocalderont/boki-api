import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ProfessionalBussinessHour')
export class ProfessionalBussinessHourEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'professional_id', type: 'int' })
    ProfessionalId: number;

    @Column({ name: 'day_of_week', type: 'int' })
    DayOfWeek: number;

    @Column({ name: 'start_time', type: 'time' })
    StartTime: Date;

    @Column({ name: 'end_time', type: 'time' })
    EndTime: Date;

    @Column({ name: 'break_start_time', type: 'time', nullable: true })
    BreakStartTime?: Date;

    @Column({ name: 'break_end_time', type: 'time', nullable: true })
    BreakEndTime?: Date;

    @Column({ name: 'vc_notes', type: 'varchar', length: 255, nullable: true })
    VcNotes?: string;

    @Column({ name: 'company_branch_room_id', type: 'int' })
    CompanyBranchRoomId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}