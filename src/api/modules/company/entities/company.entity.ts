import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ServiceEntity } from '../../service/entities/service.entity';
import { CompanyBlockedTimeEntity } from './companyBlockedTime.entity';
import { CategoryServiceEntity } from '../../categoryService/entities/categoryService.entity';
import { ClientEntity } from '../../client/entities/client.entity';
import { CompanyWhatsappSettingEntity } from '../../llm/entities/companyWhatsappSetting.entity';
import { CompanyFlowDefinitionEntity } from '../../llm/entities/companyFlowDefinition.entity';

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

    @Column({ name: 'i_frequency_scheduling', type: 'int', default: 10 })
    IFrequencyScheduling: number;

    @Column({ name: 'tx_logo', type: 'text', nullable: true })
    TxLogo?: string;

    @Column({ name: 'tx_images', type: 'text', nullable: true })
    TxImages?: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @OneToMany(() => ServiceEntity, service => service.Company)
    Services: ServiceEntity[];

    @OneToMany(() => CategoryServiceEntity, category => category.Company)
    Categories: CategoryServiceEntity[];

    @OneToMany(() => ClientEntity, client => client.Company)
    Clients: ClientEntity[];

    @OneToMany(() => CompanyWhatsappSettingEntity, companyWhatsappSetting => companyWhatsappSetting.Company)
    CompanyWhatsappSettings: CompanyWhatsappSettingEntity[];

    @OneToMany(() => CompanyFlowDefinitionEntity, companyFlowDefinition => companyFlowDefinition.Company)
    CompanyFlowDefinitions: CompanyFlowDefinitionEntity[];

    @OneToMany(() => CompanyBlockedTimeEntity, companyBlockedTime => companyBlockedTime.Company)
    CompanyBlockedTimes: CompanyBlockedTimeEntity[];
}