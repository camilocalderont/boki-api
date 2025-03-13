import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../schemas/create-client.schema';
import { ApiTokenGuard } from '../../utils/api-token.guard';

@ApiTags('clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @UseGuards(ApiTokenGuard)
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'List of all clients' })
  async findAll() {
    return await this.clientService.findAll();
  }

  @Get(':id')
  @UseGuards(ApiTokenGuard)
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponse({ status: 200, description: 'Client found' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.clientService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientService.create(createClientDto);
  }

  @Put(':id')
  @UseGuards(ApiTokenGuard)
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: Partial<CreateClientDto>
  ) {
    return await this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @UseGuards(ApiTokenGuard)
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.clientService.delete(id);
  }
}
