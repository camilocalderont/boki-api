import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceEntity } from '../../service/entities/service.entity';
import { CompanyEntity } from '../../company/entities/company.entity';

@Entity('CategoryService')
export class CategoryServiceEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Index()
    @Column({ name: 'company_id', type: 'int' })
    CompanyId: number;

    @Column({ name: 'vc_name', type: 'varchar', length: 100 })
    VcName: string;

    @Column({ name: 'b_is_service', type: 'boolean', default: false })
    BIsService: boolean;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => CompanyEntity, company => company.Categories)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;

    @OneToMany(() => ServiceEntity, service => service.Category)
    Services: ServiceEntity[];
}
