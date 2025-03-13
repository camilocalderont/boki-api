import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { ClientModule } from './modules/appointments/client/client.module';
import { AuthModule } from './modules/appointments/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.POSTGRES_DB_HOST,
      port: parseInt(config.POSTGRES_DB_PORT, 10) || 5432,
      username: config.POSTGRES_DB_USER,
      password: config.POSTGRES_DB_PASSWORD,
      database: config.POSTGRES_DB_NAME,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true, // Set to false in production
      autoLoadEntities: true,
    }),
    ClientModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
