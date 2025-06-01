import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';

@Entity('CompanyWhatsappSetting')
export class CompanyWhatsappSettingEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'company_id', type: 'int' })
    CompanyId: number;

    @Column({ name: 'vc_phone_number_id', type: 'varchar', length: 250 })
    VcPhoneNumberId: string;

    @Column({ name: 'vc_phone_number', type: 'varchar', length: 20 })
    VcPhoneNumber: string;

    @Column({ name: 'vc_display_name', type: 'varchar', length: 100 })
    VcDisplayName: string;

    @Column({ name: 'vc_access_token', type: 'varchar', length: 250 })
    VcAccessToken: string;

    @Column({ name: 'vc_bot_name', type: 'varchar', length: 100 })
    VcBotName: string;

    @Column({ name: 'b_is_active', type: 'boolean', default: true })
    BIsActive: boolean;
    
    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => CompanyEntity, company => company.CompanyWhatsappSettings)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;

}
