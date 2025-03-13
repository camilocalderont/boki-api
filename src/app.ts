import 'reflect-metadata';
import { createBot } from '@builderbot/bot';
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres';
import { provider } from './bot/provider';
import { config } from './bot/config';
import templates from './bot/templates';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const BOT_PORT = config.PORT || 3001; 
const API_PORT = process.env.API_PORT || 3000;

async function main() {
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('BokiBot API')
    .setDescription('Documentación de la API de BokiBot')
    .setVersion('1.0')
    // .addBearerAuth() // Descomenta si usas autenticación JWT
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(+API_PORT);
  console.log(`NestJS corriendo en el puerto ${API_PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${API_PORT}/api-docs`);
}

main();
