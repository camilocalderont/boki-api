import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../schemas/create-client.dto';
import { ClientEntity } from '../entities/client.entity';

@ApiTags('Clientes')
// Si deseas que toda la documentación Swagger muestre que requiere x-api-token,
// puedes ponerlo a nivel de clase:
@ApiSecurity('x-api-token')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo cliente' })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({ status: 201, description: 'Cliente creado', type: ClientEntity })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Email duplicado' })
  async create(@Body() createClientDto: CreateClientDto): Promise<ClientEntity> {
    return this.clientService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes', type: [ClientEntity] })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async findAll(): Promise<ClientEntity[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado', type: ClientEntity })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ClientEntity> {
    return this.clientService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar cliente' })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({ status: 200, description: 'Actualizado', type: ClientEntity })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @ApiResponse({ status: 409, description: 'Email duplicado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: Partial<CreateClientDto>,
  ): Promise<ClientEntity> {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar cliente' })
  @ApiResponse({ status: 204, description: 'Eliminado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clientService.remove(id);
  }
}
