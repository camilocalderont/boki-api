import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';
import { CompanyBranchRoomEntity } from './companyBranchRoom.entity';

@Entity('CompanyBranch')
export class CompanyBranchEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'company_id', type: 'int' })
    CompanyId: number;

    @ManyToOne(() => CompanyEntity)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;

    @OneToMany(() => CompanyBranchRoomEntity, companyBranchRoom => companyBranchRoom.CompanyBranch)
    CompanyBranchRooms: CompanyBranchRoomEntity[];

    @Column({ name: 'vc_name', type: 'varchar', length: 100 })
    VcName: string;

    @Column({ name: 'vc_description', type: 'varchar', length: 255, nullable: true })
    VcDescription?: string;

    @Column({ name: 'vc_address', type: 'varchar', length: 150 })
    VcAddress: string;

    @Column({ name: 'vc_email', type: 'varchar', length: 100 })
    VcEmail: string;

    @Column({ name: 'vc_phone', type: 'varchar', length: 20, nullable: true })
    VcPhone?: string;

    @Column({ name: 'vc_branch_manager_name', type: 'varchar', length: 100, nullable: true })
    VcBranchManagerName?: string;

    @Column({ name: 'vc_image', type: 'varchar', length: 255, nullable: true })
    VcImage?: string;

    @Column({ name: 'b_is_principal', type: 'boolean', default: false })
    BIsPrincipal: boolean;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
