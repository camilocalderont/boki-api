import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { ClientRepository } from './repositories/client.repository';
import { ClientEntity } from './entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity]), // Repositorio de ClientEntity
  ],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository],
  exports: [ClientService], // Si otro módulo necesita usar ClientService
})
export class ClientModule {}
