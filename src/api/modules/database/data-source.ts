import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { ClientEntity } from '../appointments/client/entities/client.entity';

// Aquí mismo, si quieres, puedes cargar dotenv, o ya lo puedes haber hecho antes:
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: Number(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_DB_USER,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: [ClientEntity],
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
