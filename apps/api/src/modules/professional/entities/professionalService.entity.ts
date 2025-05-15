import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProfessionalEntity } from './professional.entity';
import { ServiceEntity } from '../../service/entities/service.entity';

@Entity('ProfessionalService')
export class ProfessionalServiceEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'professional_id', type: 'int' })
    ProfessionalId: number;

    @Column({ name: 'service_id', type: 'int' })
    ServiceId: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    @ManyToOne(() => ProfessionalEntity, professional => professional.Services)
    @JoinColumn({ name: 'professional_id' })
    Professional: ProfessionalEntity;

    @ManyToOne(() => ServiceEntity, service => service.ProfessionalServices)
    @JoinColumn({ name: 'service_id' })
    Service: ServiceEntity;
}