import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TagsEntity } from '../../tags/entities/tags.entity';
import { FaqsEntity } from './faqs.entity';
@Entity('Faqs_Tags')
export class FaqsTagsEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'faqs_id', type: 'int' })
    FaqsId: number;

    @Column({ name: 'tags_id', type: 'int' })
    TagsId: number;

    @ManyToOne(() => FaqsEntity, faq => faq.Id)
    @JoinColumn({ name: 'faqs_id' })
    Faq: FaqsEntity;

    @ManyToOne(() => TagsEntity, tag => tag.Id)
    @JoinColumn({ name: 'tags_id' })
    Tag: TagsEntity;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
