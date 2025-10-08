import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompanyEntity } from '../../company/entities/company.entity';

@Entity('EmailTemplates')
export class EmailTemplatesEntity {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'category_name', type: 'varchar', length: 255 })
    CategoryName: string;

    @Column({ name: 'context_description', type: 'text' })
    ContextDescription: string;

    @Column({ name: 'search_keywords', type: 'text', nullable: true })
    SearchKeywords: string;

    @Column({ name: 'company_id', type: 'integer' })
    CompanyId: number;

    @Column({ 
        name: 'embedding',
        type: 'text',
        nullable: true,
        transformer: {
            to: (value: number[] | null) => value ? JSON.stringify(value) : null,
            from: (value: string | null) => value ? JSON.parse(value) : null
        }
    })
    Embedding: number[] | null;

    @CreateDateColumn({ name: 'created_at' })
    CreatedAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    UpdatedAt: Date;

    @ManyToOne(() => CompanyEntity)
    @JoinColumn({ name: 'company_id' })
    Company: CompanyEntity;
}