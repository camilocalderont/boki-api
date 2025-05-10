import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';
import { CategoryServiceEntity } from '../../categoryService/entities/categoryService.entity';
import { FaqsTagsEntity } from './faqs-tags.entity';

@Entity('Faqs')
export class FaqsEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'vc_question', type: 'varchar', length: 500 })
    VcQuestion: string;

    @Column({ name: 'vc_answer', type: 'text' })
    VcAnswer: string;

    @Column({ name: 'company_id', type: 'int' })
    CompanyId: number;

    @Column({ name: 'category_service_id', type: 'int' })
    CategoryServiceId: number;

    @ManyToOne(() => CompanyEntity, company => company.Id)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;

    @ManyToOne(() => CategoryServiceEntity, categoryService => categoryService.Id)
    @JoinColumn({ name: 'category_service_id' })
    CategoryService: CategoryServiceEntity;

    @OneToMany(() => FaqsTagsEntity, faqsTags => faqsTags.Faq)
    FaqsTags: FaqsTagsEntity[];

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}