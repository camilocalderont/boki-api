import {Controller, Inject, ValidationPipe, UsePipes} from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../dto/clientCreate.dto';
import { UpdateClientDto } from '../dto/clientUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';



@Controller('clients')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class ClientController extends BaseCrudController<ClientEntity, CreateClientDto, UpdateClientDto> {
  constructor(
    @Inject(ClientService)
    private readonly clientService: ClientService
  ) {
    super(clientService, 'clients');
  }
}
