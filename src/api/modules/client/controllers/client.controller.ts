import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  ParseIntPipe,
  Inject,
  Req,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Query,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse, ApiBody, ApiSecurity, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../schemas/create-client.dto';
import { ClientEntity } from '../entities/client.entity';
import { LoggingReportService, ApiResponse, ErrorType } from '../../../shared/utils/loggingReport.service';

/**
 * Controller for managing client operations
 * Provides endpoints for CRUD operations on clients
 */
@ApiTags('Clientes')
@ApiSecurity('x-api-token')
@ApiHeader({
  name: 'x-request-id',
  description: 'Identificador único de solicitud para seguimiento (opcional)',
  required: false
})
@Controller('clients')
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transformOptions: { enableImplicitConversion: true }
}))
export class ClientController {
  constructor(
    @Inject(ClientService)
    private readonly clientService: ClientService,
    @Inject(LoggingReportService)
    private readonly loggingService: LoggingReportService
  ) {}

  /**
   * Crear un nuevo cliente
   * @param createClientDto Datos del cliente
   * @param req Objeto de solicitud Express
   * @returns Respuesta API estandarizada con datos del cliente creado
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo cliente' })
  @ApiBody({ type: CreateClientDto })
  @SwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'Cliente creado exitosamente',
    schema: {
      example: {
        apiStatus: true,
        data: {
          id: 1,
          VcIdentificationNumber: '12345678A',
          VcPhone: '+573001234567',
          vcNickName: 'Johnny',
          VcFirstName: 'Juan',
          VcSecondName: 'Carlos',
          VcFirstLastName: 'Pérez',
          VcSecondLastName: 'Gómez',
          VcEmail: 'juan.perez@example.com',
          dtCreatedAt: '2025-03-29T08:40:47.000Z',
          dtUpdatedAt: '2025-03-29T08:40:47.000Z'
        },
        statusType: 'SUCCESS',
        statusCode: 201,
        statusMessage: 'Cliente creado exitosamente'
      }
    }
  })
  @SwaggerResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
    schema: {
      example: {
        apiStatus: false,
        data: null,
        statusType: 'ERROR',
        statusCode: 400,
        statusMessage: 'Error de validación en los datos de entrada',
        errors: [
          {
            code: 'VALIDATION_VCEMAIL',
            message: 'Debe proporcionar un correo electrónico válido',
            field: 'VcEmail'
          },
          {
            code: 'VALIDATION_VCIDENTIFICATIONNUMBER',
            message: 'El número de identificación debe tener entre 5 y 50 caracteres',
            field: 'VcIdentificationNumber'
          }
        ]
      }
    }
  })
  @SwaggerResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflicto de datos',
    schema: {
      example: {
        apiStatus: false,
        data: null,
        statusType: 'ERROR',
        statusCode: 409,
        statusMessage: 'Ya existe un cliente con este correo electrónico o número de identificación',
        errors: [
          {
            code: 'CONFLICT_VCEMAIL',
            message: 'Ya existe un cliente con este correo electrónico',
            field: 'VcEmail'
          }
        ]
      }
    }
  })
  async create(
    @Body() createClientDto: CreateClientDto,
    @Req() req: Request
  ): Promise<ApiResponse<ClientEntity>> {
    try {
      // Extraer ID de solicitud si está presente
      const requestId = req.headers['x-request-id'] as string;

      // Validar campos críticos
      if (!createClientDto.VcIdentificationNumber) {
        throw new BadRequestException('El número de identificación es requerido');
      }

      if (!createClientDto.VcEmail) {
        throw new BadRequestException('El correo electrónico es requerido');
      }

      if (!createClientDto.VcPassword) {
        throw new BadRequestException('La contraseña es requerida');
      }

      // Crear cliente
      const client = await this.clientService.create(createClientDto);

      // Retornar respuesta estandarizada
      return this.loggingService.loggingData(
        client,
        'clients/create',
        requestId,
        'Cliente creado exitosamente'
      );
    } catch (error) {
      // Manejar tipos específicos de error
      if (error instanceof ConflictException) {
        throw error; // Dejar que el filtro de excepciones global lo maneje
      }

      if (error instanceof BadRequestException) {
        throw error; // Dejar que el filtro de excepciones global lo maneje
      }

      // Para errores inesperados, relanzar para ser manejados por el filtro de excepciones global
      throw error;
    }
  }

  /**
   * Obtener todos los clientes con opciones de filtrado
   * @param req Objeto de solicitud Express
   * @param identificationNumber Filtrar por número de identificación (opcional)
   * @param email Filtrar por correo electrónico (opcional)
   * @param phone Filtrar por número de teléfono (opcional)
   * @returns Respuesta API estandarizada con lista de clientes
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener clientes' })
  @ApiQuery({ name: 'identificationNumber', required: false, description: 'Filtrar por número de identificación' })
  @ApiQuery({ name: 'email', required: false, description: 'Filtrar por correo electrónico' })
  @ApiQuery({ name: 'phone', required: false, description: 'Filtrar por número de teléfono' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Lista de clientes obtenida exitosamente',
    schema: {
      example: {
        apiStatus: true,
        data: [
          {
            id: 1,
            VcIdentificationNumber: '12345678A',
            VcPhone: '+573001234567',
            vcNickName: 'Johnny',
            VcFirstName: 'Juan',
            VcSecondName: 'Carlos',
            VcFirstLastName: 'Pérez',
            VcSecondLastName: 'Gómez',
            VcEmail: 'juan.perez@example.com',
            dtCreatedAt: '2025-03-29T08:40:47.000Z',
            dtUpdatedAt: '2025-03-29T08:40:47.000Z'
          }
        ],
        statusType: 'SUCCESS',
        statusCode: 200,
        statusMessage: 'Información entregada correctamente'
      }
    }
  })
  @SwaggerResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido',
    schema: {
      example: {
        apiStatus: false,
        data: null,
        statusType: 'ERROR',
        statusCode: 401,
        statusMessage: 'Error de autenticación'
      }
    }
  })
  async findAll(
    @Req() req: Request,
    @Query('identificationNumber') identificationNumber?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string
  ): Promise<ApiResponse<ClientEntity[]>> {
    const requestId = req.headers['x-request-id'] as string;

    try {
      // Implementar filtros si están presentes
      const filters = {};

      if (identificationNumber) {
        filters['VcIdentificationNumber'] = identificationNumber;
      }

      if (email) {
        filters['VcEmail'] = email;
      }

      if (phone) {
        filters['VcPhone'] = phone;
      }

      // Obtener clientes con filtros aplicados
      const clients = await this.clientService.findAll(filters);

      return this.loggingService.loggingData(
        clients,
        'clients/findAll',
        requestId,
        'Información entregada correctamente'
      );
    } catch (error) {
      throw error; // Dejar que el filtro de excepciones global lo maneje
    }
  }

  /**
   * Obtener cliente por ID
   * @param id ID del cliente
   * @param req Objeto de solicitud Express
   * @returns Respuesta API estandarizada con datos del cliente
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Cliente encontrado',
    schema: {
      example: {
        apiStatus: true,
        data: {
          id: 1,
          VcIdentificationNumber: '12345678A',
          VcPhone: '+573001234567',
          vcNickName: 'Johnny',
          VcFirstName: 'Juan',
          VcSecondName: 'Carlos',
          VcFirstLastName: 'Pérez',
          VcSecondLastName: 'Gómez',
          VcEmail: 'juan.perez@example.com',
          dtCreatedAt: '2025-03-29T08:40:47.000Z',
          dtUpdatedAt: '2025-03-29T08:40:47.000Z'
        },
        statusType: 'SUCCESS',
        statusCode: 200,
        statusMessage: 'Información entregada correctamente'
      }
    }
  })
  @SwaggerResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente no encontrado',
    schema: {
      example: {
        apiStatus: false,
        data: null,
        statusType: 'ERROR',
        statusCode: 404,
        statusMessage: 'Cliente con ID 1 no encontrado'
      }
    }
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ): Promise<ApiResponse<ClientEntity>> {
    const requestId = req.headers['x-request-id'] as string;

    try {
      const client = await this.clientService.findOne(id);

      if (!client) {
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }

      return this.loggingService.loggingData(
        client,
        `clients/findOne/${id}`,
        requestId,
        'Información entregada correctamente'
      );
    } catch (error) {
      // Dejar que el filtro de excepciones global lo maneje
      throw error;
    }
  }

  /**
   * Actualizar cliente por ID
   * @param id ID del cliente
   * @param updateClientDto Datos del cliente a actualizar
   * @param req Objeto de solicitud Express
   * @returns Respuesta API estandarizada con datos del cliente actualizado
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar cliente' })
  @ApiBody({ type: CreateClientDto })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Cliente actualizado exitosamente',
    schema: {
      example: {
        apiStatus: true,
        data: {
          id: 1,
          VcIdentificationNumber: '12345678A',
          VcPhone: '+573001234567',
          vcNickName: 'Johnny',
          VcFirstName: 'Juan',
          VcSecondName: 'Carlos',
          VcFirstLastName: 'Pérez',
          VcSecondLastName: 'Gómez',
          VcEmail: 'juan.perez@example.com',
          dtCreatedAt: '2025-03-29T08:40:47.000Z',
          dtUpdatedAt: '2025-03-29T08:45:47.000Z'
        },
        statusType: 'SUCCESS',
        statusCode: 200,
        statusMessage: 'Cliente actualizado exitosamente'
      }
    }
  })
  @SwaggerResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
  @SwaggerResponse({ status: HttpStatus.NOT_FOUND, description: 'Cliente no encontrado' })
  @SwaggerResponse({ status: HttpStatus.CONFLICT, description: 'Conflicto de datos' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: Partial<CreateClientDto>,
    @Req() req: Request
  ): Promise<ApiResponse<ClientEntity>> {
    const requestId = req.headers['x-request-id'] as string;

    try {
      // Verificar si el cliente existe
      const existingClient = await this.clientService.findOne(id);

      if (!existingClient) {
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }

      // Validar campos críticos
      if (updateClientDto.VcPassword !== undefined && updateClientDto.VcPassword === '') {
        throw new BadRequestException('La contraseña no puede estar vacía si se proporciona');
      }

      // Si se está actualizando el número de identificación, verificar que no exista otro cliente con ese número
      if (updateClientDto.VcIdentificationNumber &&
          updateClientDto.VcIdentificationNumber !== existingClient.VcIdentificationNumber) {
        const existingClientWithIdNumber = await this.clientService.findByIdentification(updateClientDto.VcIdentificationNumber);
        if (existingClientWithIdNumber && existingClientWithIdNumber.id !== id) {
          throw new ConflictException(`Ya existe un cliente con el número de identificación ${updateClientDto.VcIdentificationNumber}`);
        }
      }

      // Si se está actualizando el correo electrónico, verificar que no exista otro cliente con ese correo
      if (updateClientDto.VcEmail && updateClientDto.VcEmail !== existingClient.VcEmail) {
        const existingClientWithEmail = await this.clientService.findByEmail(updateClientDto.VcEmail);
        if (existingClientWithEmail && existingClientWithEmail.id !== id) {
          throw new ConflictException(`Ya existe un cliente con el correo electrónico ${updateClientDto.VcEmail}`);
        }
      }

      // Actualizar cliente
      const updatedClient = await this.clientService.update(id, updateClientDto);

      return this.loggingService.loggingData(
        updatedClient,
        `clients/update/${id}`,
        requestId,
        'Cliente actualizado exitosamente'
      );
    } catch (error) {
      // Dejar que el filtro de excepciones global lo maneje
      throw error;
    }
  }

  /**
   * Eliminar cliente por ID
   * @param id ID del cliente
   * @param req Objeto de solicitud Express
   * @returns Respuesta vacía con código de estado 204
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar cliente' })
  @SwaggerResponse({ status: HttpStatus.NO_CONTENT, description: 'Cliente eliminado exitosamente' })
  @SwaggerResponse({ status: HttpStatus.NOT_FOUND, description: 'Cliente no encontrado' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ): Promise<void> {
    const requestId = req.headers['x-request-id'] as string;

    try {
      // Verificar si el cliente existe
      const existingClient = await this.clientService.findOne(id);

      if (!existingClient) {
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }

      // Eliminar cliente
      await this.clientService.remove(id);

      // Registrar la eliminación (sin respuesta para 204 No Content)
      this.loggingService.deletedData(
        `clients/delete/${id}`,
        requestId,
        `Cliente con ID ${id} eliminado exitosamente`
      );

      return;
    } catch (error) {
      // Dejar que el filtro de excepciones global lo maneje
      throw error;
    }
  }
}
