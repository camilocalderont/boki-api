# Manual Técnico: Proyecto BokiBot con NestJS

## Estructura del Proyecto

La estructura del proyecto BokiBot está diseñada para maximizar la escalabilidad y mantenibilidad siguiendo principios de arquitectura limpia y organización modular.

```
src/
  |-- api/                     # Punto de entrada de la API
  |     |-- main.ts            # Archivo bootstrap principal
  |     |-- app.module.ts      # Módulo raíz
  |     |-- app.controller.ts  # Controlador raíz
  |     |
  |     |-- database/          # Configuración de base de datos
  |     |     |-- migrations/  # Migraciones de base de datos
  |     |     |-- seeders/     # Semillas de datos iniciales
  |     |     |-- database.module.ts # Módulo de configuración de base de datos
  |     |
  |     |-- modules/           # Módulos de aplicación por dominio
  |     |     |-- users/       # Ejemplo: Módulo de usuarios
  |     |     |     |-- dto/   # Data Transfer Objects
  |     |     |     |-- entities/ # Entidades del dominio de usuarios
  |     |     |     |-- repositories/ # Interfaces de repositorios específicos
  |     |     |     |-- controllers/ # Controladores
  |     |     |     |-- services/ # Servicios (casos de uso)
  |     |     |     |-- users.module.ts
  |     |     |
  |     |     |-- appointments/ # Módulo de citas
  |     |     |-- professionals/ # Módulo de profesionales
  |     |     |-- services/    # Módulo de servicios
  |     |
  |     |-- shared/            # Recursos compartidos
  |     |     |-- decorators/  # Decoradores personalizados
  |     |     |-- filters/     # Filtros de excepción globales
  |     |     |-- interceptors/ # Interceptores globales
  |     |     |-- interfaces/  # Interfaces comunes compartidas
  |     |     |-- exceptions/  # Excepciones personalizadas compartidas
  |     |     |-- persistence/ # Implementaciones de repositorios genéricos
  |     |     |-- utils/       # Funciones de utilidad
  |     |
  |     |-- config/            # Configuración de la aplicación
  |     |     |-- env.config.ts # Configuración de variables de entorno
  |     |     |-- app.config.ts # Configuración general de la aplicación
  |
  |-- bot/                     # Funcionalidad del bot
  |     |-- config/            # Configuración del bot
  |     |     |-- index.ts     # Archivo principal de configuración
  |     |
  |     |-- provider/          # Proveedores para conectar a plataformas
  |     |     |-- index.ts     # Exportación de proveedores
  |     |     |-- meta.ts      # Configuración para WhatsApp Meta
  |     |
  |     |-- services/          # Servicios del bot
  |     |     |-- llm/         # Servicios de modelos de lenguaje (LLM)
  |     |     |     |-- aiServices.ts  # Servicios de IA
  |     |
  |     |-- templates/         # Plantillas de flujos de conversación
  |     |     |-- index.ts     # Exportación de plantillas
  |     |     |-- mainFlow.ts  # Flujo principal de conversación
  |     |     |-- faqFlow.ts   # Flujo para preguntas frecuentes
```

## Componentes Principales

### 1. API (src/api)

Punto de entrada principal de la aplicación. Define el módulo raíz que importa y configura todos los demás módulos.

**app.module.ts**:
```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { BotModule } from '../bot/bot.module';
import { UsersModule } from './modules/users/users.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
// Otros módulos...

@Module({
  imports: [
    DatabaseModule,
    BotModule,
    UsersModule,
    AppointmentsModule,
    // Otros módulos...
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

**main.ts**:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración global
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
```

### 2. Bot (src/bot)

Contiene toda la lógica relacionada con el bot de WhatsApp utilizando @builderbot/bot.

**bot.module.ts**:
```typescript
import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { UsersModule } from '../modules/users/users.module';
import { AppointmentsModule } from '../modules/appointments/appointments.module';

@Module({
  imports: [UsersModule, AppointmentsModule],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
```

### 3. Modules (src/modules)

Cada módulo representa un dominio de negocio específico, siguiendo el principio de "separation of concerns".

**Ejemplo de estructura para el módulo de usuarios**:

```typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
```

### 4. Shared (src/shared)

Contiene recursos compartidos por toda la aplicación, como interfaces, excepciones personalizadas, filtros y utilidades.

**Repositorio Genérico**:
```typescript
// shared/persistence/generic.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class GenericRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<T> {
    return this.repository.findOne({ where: { id } });
  }

  async create(entity: Partial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  // Otros métodos comunes...
}
```

**Filtro de Excepciones HTTP**:
```typescript
// shared/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message: typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message
        : exceptionResponse,
    });
  }
}
```

## Implementación de Joi para Validación de DTOs

NestJS soporta nativamente Joi para la validación de esquemas DTO. Para implementarlo:

1. Instala las dependencias necesarias:
```bash
npm install --save joi @nestjs/config
```

2. Configura el módulo de configuración para usar Joi:
```typescript
// config/app.config.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        // Otras variables de entorno...
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
```

3. Para validar DTOs con Joi:
```typescript
// modules/users/dto/create-user.dto.ts
import { Injectable } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../../shared/pipes/joi-validation.pipe';
import * as Joi from 'joi';

// Define el esquema de validación
export const CreateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Crear un pipe personalizado para Joi
// shared/pipes/joi-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException('Validation failed: ' + error.message);
    }
    return value;
  }
}

// Uso en un controlador
// users.controller.ts
@Post()
@UsePipes(new JoiValidationPipe(CreateUserSchema))
create(@Body() createUserDto: any) {
  return this.usersService.create(createUserDto);
}
```

## Estandarización de Mensajes de Error (Similar a Boom)

NestJS proporciona mecanismos nativos para estandarizar los mensajes de error, similar a Boom en Hapi.js:

1. Crear excepciones personalizadas:

```typescript
// shared/exceptions/application.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error: string = 'Error interno de la aplicación',
    details?: any,
  ) {
    super(
      {
        statusCode,
        error,
        message,
        details,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}
```

2. Crear excepciones específicas:

```typescript
// shared/exceptions/not-found.exception.ts
import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from './application.exception';

export class NotFoundException extends ApplicationException {
  constructor(
    entity: string,
    id?: string | number,
    details?: any,
  ) {
    const message = id
      ? `${entity} con id ${id} no encontrado`
      : `${entity} no encontrado`;

    super(
      message,
      HttpStatus.NOT_FOUND,
      'Recurso no encontrado',
      details,
    );
  }
}

// Otros tipos de excepciones...
// shared/exceptions/bad-request.exception.ts
// shared/exceptions/unauthorized.exception.ts
// etc.
```

3. Implementar un filtro global para capturar y formatear todas las excepciones:

```typescript
// shared/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error = 'Error interno';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      // Extract information from the exception response
      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse.message || message;
        error = exceptionResponse.error || error;
        details = exceptionResponse.details || null;
      } else {
        message = exceptionResponse;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      details,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
```

4. Registrar el filtro globalmente en main.ts:

```typescript
// api/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
```

5. Uso en servicios:

```typescript
// api/modules/users/services/users.service.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundException } from '../../shared/exceptions/not-found.exception';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario', id);
    }
    return user;
  }

  // Otros métodos...
}
```

## Integración entre API y Bot

La integración entre la API RESTful y el bot de WhatsApp se realiza mediante la inyección de dependencias:

```typescript
// bot/bot.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createBot, createProvider, createFlow } from '@builderbot/bot';
import { UsersService } from '../modules/users/services/users.service';
import { AppointmentsService } from '../modules/appointments/services/appointments.service';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: any;

  constructor(
    private readonly usersService: UsersService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async onModuleInit() {
    // Configuración inicial del bot
    const provider = createProvider();

    const appointmentFlow = createFlow([
      // Definir los pasos del flujo para gestionar citas
    ]);

    this.bot = createBot({
      flow: appointmentFlow,
      provider,
    });

    // Iniciar el bot
    this.bot.start();
  }

  // Métodos para interactuar con el bot desde otros servicios
  async sendNotification(userId: string, message: string) {
    // Implementación para enviar notificaciones a través del bot
  }
}
```


## Conclusiones y Mejores Prácticas

1. **Principio de responsabilidad única**: Cada módulo, servicio y controlador tiene una responsabilidad clara y específica.

2. **Inversión de dependencias**: Utilizamos interfaces para definir contratos y reducir el acoplamiento entre componentes.

3. **Patrón repositorio**: Encapsula la lógica de acceso a datos, facilitando cambios en la capa de persistencia.

4. **Validación centralizada**: Implementamos validación mediante Joi y los pipes de validación de NestJS.

5. **Manejo de errores estandarizado**: Creamos excepciones personalizadas y filtros para proporcionar respuestas de error consistentes.

6. **Modularidad**: La aplicación está dividida en módulos independientes que pueden evolucionar por separado.

7. **Integración bot-API**: Ambos componentes comparten la misma base de código, lo que facilita la comunicación y el uso de servicios comunes.

8. **Escalabilidad**: La estructura permite añadir nuevos módulos y funcionalidades sin afectar las existentes.

9. **Reglas al escribir código**
- Los DTO deben estar libres de lógica de validación y especificación de swagger.
- Cada entidad debe tener su propio archivo de esquema de validación.


Esta arquitectura ofrece un equilibrio entre flexibilidad y estructura, permitiendo que el proyecto crezca de manera organizada sin caer en excesiva complejidad.
