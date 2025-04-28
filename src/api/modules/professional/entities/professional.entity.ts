import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Professional')
export class ProfessionalEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'vc_first_name', type: 'varchar', length: 100 })
    VcFirstName: string;

    @Column({ name: 'vc_second_name', type: 'varchar', length: 100, nullable: true })
    VcSecondName?: string;

    @Column({ name: 'vc_first_last_name', type: 'varchar', length: 100 })
    VcFirstLastName: string;

    @Column({ name: 'vc_second_last_name', type: 'varchar', length: 100, nullable: true })
    VcSecondLastName?: string;

    @Column({ name: 'vc_email', type: 'varchar', length: 100, unique: true })
    VcEmail: string;

    @Column({ name: 'vc_phone', type: 'varchar', length: 20, nullable: true })
    VcPhone?: string;

    @Column({ name: 'vc_identification_number', type: 'varchar', length: 20, unique: true })
    VcIdentificationNumber: string;

    @Column({ name: 'vc_license_number', type: 'varchar', length: 50, nullable: true })
    VcLicenseNumber?: string;

    @Column({ name: 'i_years_of_experience', type: 'int', default: 0 })
    IYearsOfExperience: number;

    @Column({ name: 'tx_photo', type: 'text', nullable: true })
    TxPhoto?: string;

    @Column({ name: 'vc_profession', type: 'varchar', length: 100 })
    VcProfession: string;

    @Column({ name: 'vc_specialization', type: 'varchar', length: 100, nullable: true })
    VcSpecialization?: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
