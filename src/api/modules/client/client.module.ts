import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { ClientEntity } from './entities/client.entity';
import { CompanyEntity } from '../company/entities/company.entity';
import { ClientRepository } from './repositories/client.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity, CompanyEntity]),
  ],
  controllers: [ClientController],
  providers: [
    ClientRepository,
    {
      provide: ClientService,
      useClass: ClientService
    }
  ],
  exports: [ClientService],
})
export class ClientModule {}
