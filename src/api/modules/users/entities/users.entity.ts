import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Users')
export class UsersEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'vc_identification_number', type: 'varchar', length: 50 })
    VcIdentificationNumber: string;

    @Column({ name: 'vc_phone', type: 'varchar', length: 20, nullable: true })
    VcPhone?: string;

    @Column({ name: 'vc_nick_name', type: 'varchar', length: 50, nullable: true })
    VcNickName?: string;

    @Column({ name: 'vc_first_name', type: 'varchar', length: 50 })
    VcFirstName: string;

    @Column({ name: 'vc_second_name', type: 'varchar', length: 50, nullable: true })
    VcSecondName?: string;

    @Column({ name: 'vc_first_last_name', type: 'varchar', length: 50 })
    VcFirstLastName: string;

    @Column({ name: 'vc_second_last_name', type: 'varchar', length: 50, nullable: true })
    VcSecondLastName?: string;

    @Column({ name: 'vc_email', type: 'varchar', length: 100, unique: true })
    VcEmail: string;

    @Column({ name: 'vc_password', type: 'varchar', length: 255 })
    VcPassword: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
