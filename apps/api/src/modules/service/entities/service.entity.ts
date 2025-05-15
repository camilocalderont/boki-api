import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';
import { CategoryServiceEntity } from '../../categoryService/entities/categoryService.entity';
import { ServiceStageEntity } from './serviceStage.entity';
import { ProfessionalServiceEntity } from '../../professional/entities/professionalService.entity';
import { AppointmentEntity } from '../../appointment/entities/appointment.entity';

@Entity('Service')
export class ServiceEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'vc_name', type: 'varchar', length: 100 })
    VcName: string;

    @Column({ name: 'vc_description', type: 'varchar', length: 500, nullable: true })
    VcDescription: string;

    @Column({ name: 'i_minimal_price', type: 'int' })
    IMinimalPrice: number;

    @Column({ name: 'i_maximal_price', type: 'int' })
    IMaximalPrice: number;

    @Column({ name: 'i_regular_price', type: 'int' })
    IRegularPrice: number;

    @Column({ name: 'd_taxes', type: 'decimal', precision: 5, scale: 2, default: 0 })
    DTaxes: number;

    @Column({ name: 'vc_time', type: 'varchar', length: 20 })
    VcTime: string;

    @Column({ name: 'tx_picture', type: 'text', nullable: true })
    TxPicture: string;

    @Index()
    @Column({ name: 'company_id', type: 'int' })
    CompanyId: number;

    @Index()
    @Column({ name: 'category_id', type: 'int' })
    CategoryId: number;

    @ManyToOne(() => CompanyEntity, company => company.Services)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;

    @ManyToOne(() => CategoryServiceEntity, category => category.Services)
    @JoinColumn({ name: 'category_id' })
    Category: CategoryServiceEntity;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @OneToMany(() => ServiceStageEntity, serviceStage => serviceStage.Service)
    ServiceStages: ServiceStageEntity[];

    @OneToMany(() => ProfessionalServiceEntity, professionalService => professionalService.Service)
    ProfessionalServices: ProfessionalServiceEntity[];

    @OneToMany(() => AppointmentEntity, appointment => appointment.Service)
    Appointments: AppointmentEntity[];
}
