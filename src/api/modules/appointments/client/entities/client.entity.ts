import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Client')
export class ClientEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ type: 'varchar', length: 50 })
  VcIdentificationNumber: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  VcPhone: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  vcNickName: string;

  @Column({ type: 'varchar', length: 50 })
  VcFirstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  VcSecondName: string;

  @Column({ type: 'varchar', length: 50 })
  VcFirstLastName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  VcSecondLastName: string;

  @Column({ type: 'varchar', length: 100 })
  VcEmail: string;

  @Column({ type: 'varchar', length: 255 })
  VcPassword: string;
}
