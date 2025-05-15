import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { ClientEntity } from '../modules/client/entities/client.entity';
import { UsersEntity } from '../modules/users/entities/users.entity';
import { CompanyEntity } from '../modules/company/entities/company.entity';
import { CompanyBlockedTimeEntity } from '../modules/company/entities/companyBlockedTime.entity';
import { CompanyBranchEntity } from '../modules/companyBranch/entities/companyBranch.entity';
import { CompanyBranchRoomEntity } from '../modules/companyBranch/entities/companyBranchRoom.entity';
import { ProfessionalEntity } from '../modules/professional/entities/professional.entity';
import { ProfessionalBussinessHourEntity } from '../modules/professional/entities/professionalBussinessHour.entity';
import { ProfessionalServiceEntity } from '../modules/professional/entities/professionalService.entity';
import { CategoryServiceEntity } from '../modules/categoryService/entities/categoryService.entity';
import { ServiceEntity } from '../modules/service/entities/service.entity';
import { ServiceStageEntity } from '../modules/service/entities/serviceStage.entity';
import { StateEntity } from '../modules/appointment/entities/state.entity';
import { AppointmentStateEntity } from '../modules/appointment/entities/appointmentState.entity';
import { AppointmentEntity } from '../modules/appointment/entities/appointment.entity';
import { AppointmentStageEntity } from '../modules/appointment/entities/appointmentStage.entity';
import { TagsEntity } from '../modules/tags/entities/tags.entity';
import { FaqsEntity } from '../modules/faqs/entities/faqs.entity';
import { FaqsTagsEntity } from '../modules/faqs/entities/faqs-tags.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: Number(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_DB_USER,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: [ClientEntity, UsersEntity, CompanyEntity, CompanyBlockedTimeEntity, CompanyBranchEntity, CompanyBranchRoomEntity, ProfessionalEntity, ProfessionalBussinessHourEntity, ProfessionalServiceEntity, CategoryServiceEntity, ServiceEntity, ServiceStageEntity, StateEntity, AppointmentStateEntity, AppointmentEntity, AppointmentStageEntity, TagsEntity, FaqsEntity, FaqsTagsEntity],
  //comando para generar migraciones npx typeorm-ts-node-commonjs migration:generate src/api/database/migrations/crateNombreTable -d src/api/database/database.module.ts
  migrations: [join(__dirname, 'migrations', '**/*.{ts,js}')],
  logging: true,
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection initialized');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
};
