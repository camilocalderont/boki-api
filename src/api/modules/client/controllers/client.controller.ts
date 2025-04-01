import {Controller, Get, Post, HttpCode, Inject, HttpStatus,BadRequestException, Query, ValidationPipe, UsePipes, Body} from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../dto/clientCreate.dto';
import { ClientEntity } from '../entities/client.entity';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { JoiValidationPipe } from '../../../shared/utils/pipes/joi-validation.pipe';
import { clientSchema } from '../schemas/client.schema';


@Controller('clients')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class ClientController extends BaseCrudController<ClientEntity> {
  constructor(
    @Inject(ClientService)
    private readonly clientService: ClientService
  ) {
    super(clientService, 'clients');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new JoiValidationPipe(clientSchema))
  async create(@Body() createClientDto: CreateClientDto): Promise<ClientEntity> {
    if (!createClientDto.VcIdentificationNumber) {
      throw new BadRequestException('Identification number is required');
    }

    if (!createClientDto.VcEmail) {
      throw new BadRequestException('Email is required');
    }

    if (!createClientDto.VcPassword) {
      throw new BadRequestException('Password is required');
    }

    return await this.clientService.create(createClientDto);
  }
}
