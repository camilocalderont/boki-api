import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyFlowDefinitionEntity } from './entities/companyFlowDefinition.entity';
import { CompanyWhatsappSettingEntity } from './entities/companyWhatsappSetting.entity';
import { CompanyFlowController } from './controllers/companyFlow.controller';
import { CompanyWhatsappSettingController } from './controllers/companyWhatsappSetting.controller';
import { CompanyFlowService } from './services/companyFlow.service';
import { CompanyWhatsappSettingService } from './services/companyWhatsappSetting.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CompanyFlowDefinitionEntity,
            CompanyWhatsappSettingEntity
        ]),
    ],
    controllers: [
        CompanyFlowController,
        CompanyWhatsappSettingController
    ],
    providers: [
        {
            provide: CompanyFlowService,
            useClass: CompanyFlowService
        },
        {
            provide: CompanyWhatsappSettingService,
            useClass: CompanyWhatsappSettingService
        }
    ],
    exports: [
        CompanyFlowService,
        CompanyWhatsappSettingService
    ],
})
export class LlmModule { }
