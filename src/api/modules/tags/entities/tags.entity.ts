import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { FaqsTagsEntity } from '../../faqs/entities/faqs-tags.entity';

@Entity('Tags')
export class TagsEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'vc_name', type: 'varchar', length: 250 })
    VcName: string;

    @OneToMany(() => FaqsTagsEntity, faqsTags => faqsTags.Tag)
    FaqsTags: FaqsTagsEntity[];

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}