import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyBranchEntity } from '../../companyBranch/entities/companyBranch.entity';

@Entity('CompanyBranchRoom')
export class CompanyBranchRoomEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @ManyToOne(() => CompanyBranchEntity)
    @JoinColumn({ name: 'company_branch_id' })
    CompanyBranch: CompanyBranchEntity;

    @Column({ name: 'vc_number', type: 'varchar', length: 100 })
    VcNumber: string;

    @Column({ name: 'vc_floor', type: 'varchar', length: 100, nullable: true })
    VcFloor?: string;

    @Column({ name: 'vc_tower', type: 'varchar', length: 100, nullable: true })
    VcTower?: string;

    @Column({ name: 'vc_phone', type: 'varchar', length: 20, nullable: true })
    VcPhone?: string;

    @Column({ name: 'vc_email', type: 'varchar', length: 100, nullable: true })
    VcEmail?: string;

    @Column({ name: 'b_is_main', type: 'boolean', default: false })
    BIsMain: boolean;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}