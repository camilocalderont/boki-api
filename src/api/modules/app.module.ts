import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './appointments/client/entities/client.entity';
import { ClientController } from './appointments/client/controllers/client.controller';
import { ClientService } from './appointments/client/services/client.service';
import { AppDataSource } from './database/data-source';
import { ConfigModule } from '@nestjs/config';
import { ApiTokenGuard } from './appointments/utils/api-token.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([ClientEntity]),
  ],
  controllers: [ClientController],
  providers: [
    ClientService,
    ApiTokenGuard
  ],
})
export class AppModule {}
