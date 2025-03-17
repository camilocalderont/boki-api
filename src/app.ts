import 'reflect-metadata';
import { createBot } from '@builderbot/bot';
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres';
import { provider } from './bot/provider';
import { config } from './bot/config';
import templates from './bot/templates';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { initializeDatabase } from './api/modules/database/data-source';

const BOT_PORT = config.PORT || 3001; 
const API_PORT = process.env.API_PORT || 3000;

async function main() {
  try {
    // Inicializar la base de datos y ejecutar migraciones si es necesario
    await initializeDatabase();

    const adapterDB = new Database({
      host: config.POSTGRES_DB_HOST,
      user: config.POSTGRES_DB_USER,
      database: config.POSTGRES_DB_NAME,
      password: config.POSTGRES_DB_PASSWORD,
      port: +config.POSTGRES_DB_PORT,
    });

    // const { handleCtx, httpServer } = await createBot({
    //   flow: templates,
    //   provider: provider,
    //   database: adapterDB,
    // });
    // httpServer(+BOT_PORT);
    // console.log(`Bot corriendo en el puerto ${BOT_PORT}`);

    const app = await NestFactory.create(AppModule);
    
    // Habilitar CORS
    app.enableCors();
    
    // Configurar pipes globales
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    const swaggerConfig = new DocumentBuilder()
      .setTitle('BokiBot API')
      .setDescription('API para la gestión de clientes y citas de BokiBot')
      .setVersion('1.0')
      .addApiKey({ 
        type: 'apiKey',
        name: 'x-api-token',
        in: 'header',
        description: 'Token de autenticación para la API'
      }, 'x-api-token')
      .build();

    const options = {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey
    };

    const document = SwaggerModule.createDocument(app, swaggerConfig, options);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(+API_PORT);
    console.log(`NestJS corriendo en el puerto ${API_PORT}`);
    console.log(`Swagger UI disponible en http://localhost:${API_PORT}/api-docs`);
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

main();
