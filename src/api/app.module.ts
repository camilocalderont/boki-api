import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';

import { AppDataSource } from './database/database.module';
import { MongoDBModule } from './database/mongodb/mongodb.module';
import { ClientModule } from './modules/client/client.module';
import { CompanyModule } from './modules/company/company.module';
import { CompanyBranchModule } from './modules/companyBranch/companyBranch.module';
import { ProfessionalModule } from './modules/professional/professional.module';
import { CategoryServiceModule } from './modules/categoryService/categoryService.module';
import { ServiceModule } from './modules/service/service.module';
import { ApiTokenGuard } from './shared/utils/api-token.guard';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { TagsModule } from './modules/tags/tags.module';
import { FaqsModule } from './modules/faqs/faqs.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { LlmModule } from './modules/llm/llm.module';
import { HealthModule } from './modules/health/health.module';
import { CompanyPromptsModule } from './modules/companyPrompts/companyPrompts.module';
import { PlanModule } from './modules/plan/plan.module';
import { CompanyPlanModule } from './modules/companyPlan/companyPlan.module';
import { CompanyPlanControlTokenModule } from './modules/companyPlanControlToken/companyPlanControlToken.module';
import { SemanticSearchModule } from './modules/semanticSearch/semanticSearch.module';
import { EmailTemplatesModule } from './modules/emailTemplates/email-templates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '2h',
        },
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forRoot(AppDataSource.options),
    MongoDBModule,
    HealthModule,
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
    LlmModule,
    CompanyPromptsModule,
    PlanModule,
    CompanyPlanModule,
    CompanyPlanControlTokenModule,
    SemanticSearchModule,
    EmailTemplatesModule
  ],
  controllers: [],
  providers: [
    Reflector,
    // API Token Guard
    {
      provide: APP_GUARD,
      useClass: ApiTokenGuard,
    },
    // JWT Auth Guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule { }