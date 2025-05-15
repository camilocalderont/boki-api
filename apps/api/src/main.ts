import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configApi } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './shared/utils/response.interceptor';
import { HttpExceptionFilter, AllExceptionsFilter } from './shared/utils/http-exception.filter';
import { DateFormatInterceptor } from './shared/interceptors/date-format.interceptor';

const API_PORT = process.env.API_PORT || 3000;
async function bootstrapApi() {

    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
    }));

    app.useGlobalInterceptors(
        new ResponseInterceptor(),
        new DateFormatInterceptor()
    );
    app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

    app.setGlobalPrefix(`api/v${configApi.VERSION}`);
    app.enableCors();


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
}
export default bootstrapApi;