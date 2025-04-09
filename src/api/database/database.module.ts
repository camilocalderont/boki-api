import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { ClientEntity } from '../modules/client/entities/client.entity';
import { CompanyEntity } from '../modules/company/entities/company.entity';
import { CompanyBranchEntity } from '../modules/companyBranch/entities/companyBranch.entity';
import { ProfessionalEntity } from '../modules/professional/entities/professional.entity';
import { CategoryServiceEntity } from '../modules/categoryService/entities/categoryService.entity';
import { ServiceEntity } from '../modules/service/entities/service.entity';

import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: Number(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_DB_USER,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: [ClientEntity, CompanyEntity, CompanyBranchEntity, ProfessionalEntity, CategoryServiceEntity, ServiceEntity],
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
