import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppDataSource } from './database/database.module';
import { ClientModule } from './modules/client/client.module';
import { CompanyModule } from './modules/company/company.module';
import { CompanyBranchModule } from './modules/companyBranch/companyBranch.module';
import { ProfessionalModule } from './modules/professional/professional.module';
import { ApiTokenGuard } from './shared/utils/api-token.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ClientModule,
    CompanyModule,
    CompanyBranchModule,
    ProfessionalModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiTokenGuard,
    }
  ],
})
export class AppModule { }
