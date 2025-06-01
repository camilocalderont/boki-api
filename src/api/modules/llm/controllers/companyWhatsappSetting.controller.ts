import { Controller, Inject, ValidationPipe } from "@nestjs/common";
import { UsePipes } from "@nestjs/common";
import { BaseCrudController } from "~/api/shared/controllers/crud.controller";
import { CompanyWhatsappSettingEntity } from "../entities/companyWhatsappSetting.entity";
import { CompanyWhatsappSettingService } from "../services/companyWhatsappSetting.service";
import { CreateCompanyWhatsappSettingDto } from "../dto/createCompanyWhatsappSetting.dto";
import { UpdateCompanyWhatsappSettingDto } from "../dto/updateCompanyWhatsappSetting.dto";
import { createCompanyWhatsappSettingSchema } from "../schemas/createCompanyWhatsappSetting.schema";
import { updateCompanyWhatsappSettingSchema } from "../schemas/updateCompanyWhatsappSetting.schema";

@Controller('companyWhatsappSetting')
@UsePipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true }
}))
export class CompanyWhatsappSettingController extends BaseCrudController<CompanyWhatsappSettingEntity, CreateCompanyWhatsappSettingDto, UpdateCompanyWhatsappSettingDto> {
    constructor(
        @Inject(CompanyWhatsappSettingService)
        private readonly companyWhatsappSettingService: CompanyWhatsappSettingService
    ) {
        super(companyWhatsappSettingService, 'companyWhatsappSetting', createCompanyWhatsappSettingSchema, updateCompanyWhatsappSettingSchema);
    }
}

