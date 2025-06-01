import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppDataSource } from './database/database.module';
import { MongoDBModule } from './database/mongodb/mongodb.module';
import { ClientModule } from './modules/client/client.module';
import { CompanyModule } from './modules/company/company.module';
import { CompanyBranchModule } from './modules/companyBranch/companyBranch.module';
import { ProfessionalModule } from './modules/professional/professional.module';
import { CategoryServiceModule } from './modules/categoryService/categoryService.module';
import { ServiceModule } from './modules/service/service.module';
import { ApiTokenGuard } from './shared/utils/api-token.guard';
import { UsersModule } from './modules/users/users.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { TagsModule } from './modules/tags/tags.module';
import { FaqsModule } from './modules/faqs/faqs.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { LlmModule } from './modules/llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    MongoDBModule,
    ClientModule,
    CompanyModule,
    CompanyBranchModule,
    CategoryServiceModule,
    ProfessionalModule,
    ServiceModule,
    UsersModule,
    AppointmentModule,
    TagsModule,
    FaqsModule,
    ConversationModule,
    LlmModule
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
