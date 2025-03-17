import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../schemas/create-client.dto';
import { ClientEntity } from '../entities/client.entity'; // Ajusta la ruta si fuera necesario
import { ApiTokenGuard } from '../../utils/api-token.guard';

@ApiTags('Clientes')
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
    @UseGuards(ApiTokenGuard)
    @ApiSecurity('x-api-token')
    @ApiOperation({ summary: 'Obtener clientes' })
    @ApiResponse({ status: 200, description: 'Lista de clientes', type: [ClientEntity] })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    async findAll(): Promise<ClientEntity[]> {
        return this.clientService.findAll();
    }

    @Get(':id')
    @UseGuards(ApiTokenGuard)
    @ApiSecurity('x-api-token')
    @ApiOperation({ summary: 'Obtener cliente por ID' })
    @ApiResponse({ status: 200, description: 'Cliente encontrado', type: ClientEntity })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ClientEntity> {
        return this.clientService.findOne(id);
    }

    @Put(':id')
    @UseGuards(ApiTokenGuard)
    @ApiSecurity('x-api-token')
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
    @UseGuards(ApiTokenGuard)
    @ApiSecurity('x-api-token')
    @HttpCode(204)
    @ApiOperation({ summary: 'Eliminar cliente' })
    @ApiResponse({ status: 204, description: 'Eliminado' })
    @ApiResponse({ status: 401, description: 'Token inválido' })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.clientService.remove(id);
    }
}
