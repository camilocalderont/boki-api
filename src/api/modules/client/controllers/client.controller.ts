import { Controller, Inject, ValidationPipe, HttpCode, UsePipes, Get, Param, HttpStatus } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { ClientEntity } from '../entities/client.entity';
import { CreateClientDto } from '../dto/clientCreate.dto';
import { UpdateClientDto } from '../dto/clientUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createClientSchema } from '../schemas/clientCreate.schema';
import { updateClientSchema } from '../schemas/clientUpdate.schema';
import { ApiControllerResponse } from '~/api/shared/interfaces/api-response.interface';
@Controller('clients')
@UsePipes(new ValidationPipe({
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class ClientController extends BaseCrudController<ClientEntity, CreateClientDto, UpdateClientDto> {
  constructor(
    @Inject(ClientService)
    private readonly clientService: ClientService
  ) {
    super(clientService, 'clients', createClientSchema, updateClientSchema);
  }

  @Get('cellphone/:cellphone')
  @HttpCode(HttpStatus.OK)
  async clientByCellphone(@Param('cellphone') cellphone: string): Promise<ApiControllerResponse<ClientEntity>> {
    const data = await this.clientService.clientByCellphone(cellphone);
    return {
      message: 'Cliente obtenido de forma exitosa',
      data: data
    };
  }

  @Get('llm/cellphone/:cellphone')
  @HttpCode(HttpStatus.OK)
  async clientByCellphoneForLLM(@Param('cellphone') cellphone: string): Promise<{ id: number; company: number; VcFirstName: string }> {
    return await this.clientService.clientByCellphoneForLLM(cellphone);
  }
}
