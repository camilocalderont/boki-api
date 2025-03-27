import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core'

// Importas tu ClientModule
import { ClientModule } from './appointments/client/client.module';

// Quizá ubiques ApiTokenGuard de manera global, si así lo deseas
import { ApiTokenGuard } from './appointments/utils/api-token.guard';

@Module({
  imports: [
    // Config global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Conexión TypeORM principal (no hace falta forFeature aquí)
    TypeOrmModule.forRoot(AppDataSource.options),

    // Ahora importa ClientModule, que ya tiene su controlador y servicio
    ClientModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiTokenGuard,
    },
  ],
})
export class AppModule {}
