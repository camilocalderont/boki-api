import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Company')
export class CompanyEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'vc_name', type: 'varchar', length: 100 })
    VcName: string;

    @Column({ name: 'vc_description', type: 'varchar', length: 255, nullable: true })
    VcDescription?: string;

    @Column({ name: 'vc_phone', type: 'varchar', length: 20, nullable: true })
    VcPhone?: string;

    @Column({ name: 'vc_principal_address', type: 'varchar', length: 150, nullable: true })
    VcPrincipalAddress?: string;

    @Column({ name: 'vc_principal_email', type: 'varchar', length: 100 })
    VcPrincipalEmail: string;

    @Column({ name: 'vc_legal_representative', type: 'varchar', length: 100, nullable: true })
    VcLegalRepresentative?: string;

    @Column({ name: 'vc_logo', type: 'varchar', length: 255, nullable: true })
    VcLogo?: string;

    @Column({ name: 'tx_images', type: 'text', nullable: true })
    TxImages?: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}