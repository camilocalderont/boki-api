import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { ClientEntity } from './entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity]),
  ],
  controllers: [ClientController],
  providers: [
    {
      provide: ClientService,
      useClass: ClientService
    }
  ],
  exports: [ClientService],
})
export class ClientModule {}
