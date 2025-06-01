import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyAgentEntity } from './entities/companyAgent.entity';
import { CompanyWhatsappSettingEntity } from './entities/companyWhatsappSetting.entity';
import { CompanyAgentController } from './controllers/companyAgent.controller';
import { CompanyWhatsappSettingController } from './controllers/companyWhatsappSetting.controller';
import { CompanyAgentService } from './services/companyAgent.service';
import { CompanyWhatsappSettingService } from './services/companyWhatsappSetting.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CompanyAgentEntity,
            CompanyWhatsappSettingEntity
        ]),
    ],
    controllers: [
        CompanyAgentController,
        CompanyWhatsappSettingController
    ],
    providers: [
        {
            provide: CompanyAgentService,
            useClass: CompanyAgentService
        },
        {
            provide: CompanyWhatsappSettingService,
            useClass: CompanyWhatsappSettingService
        }
    ],
    exports: [
        CompanyAgentService,
        CompanyWhatsappSettingService
    ],
})
export class LlmModule { }
