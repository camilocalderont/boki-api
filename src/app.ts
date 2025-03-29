import 'reflect-metadata';
import { createBot } from '@builderbot/bot';
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres';
import { provider } from './bot/provider';
import { config } from './bot/config';
import { configApi } from './api/config';
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

    app.setGlobalPrefix(`api/v${configApi.VERSION}`);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    const swaggerConfig = new DocumentBuilder()
      .setTitle('BokiBot API')
      .addApiKey({
        type: 'apiKey',
        name: 'x-api-token',
        in: 'header',
        description: 'Authentication token for the API'
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
    console.log(`NestJS running on the port ${API_PORT}`);
    console.log(`Swagger UI available in http://localhost:${API_PORT}/api-docs`);
  } catch (error) {
    const errorCode = 1001;
    const customErrorMessage = 'A critical error occurred while starting the application';
    console.error(`[${customErrorMessage}] (Code: ${errorCode}) =>`, error.message);
    console.error(error.stack);
    process.exit(errorCode);
  }
}

main();
