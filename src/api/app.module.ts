import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { AppDataSource } from './database/data-source';

import { LoggingReportService, AllExceptionsFilter} from './shared/utils/loggingReport.service';
import { ClientModule } from './modules/client/client.module';
import { ApiTokenGuard } from './shared/utils/api-token.guard';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ClientModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiTokenGuard,
    },
    LoggingReportService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule { }
