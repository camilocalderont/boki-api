import { Controller, Inject, ValidationPipe, Get, Param, ParseIntPipe, HttpCode, HttpStatus } from "@nestjs/common";
import { UsePipes } from "@nestjs/common";
import { BaseCrudController } from "~/api/shared/controllers/crud.controller";
import { CompanyWhatsappSettingEntity } from "../entities/companyWhatsappSetting.entity";
import { CompanyWhatsappSettingService } from "../services/companyWhatsappSetting.service";
import { CreateCompanyWhatsappSettingDto } from "../dto/createCompanyWhatsappSetting.dto";
import { UpdateCompanyWhatsappSettingDto } from "../dto/updateCompanyWhatsappSetting.dto";
import { createCompanyWhatsappSettingSchema } from "../schemas/createCompanyWhatsappSetting.schema";
import { updateCompanyWhatsappSettingSchema } from "../schemas/updateCompanyWhatsappSetting.schema";
import { ApiControllerResponse } from "~/api/shared/interfaces/api-response.interface";

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

    @Get('company/:id')
    @HttpCode(HttpStatus.OK)
    async findByCompany(@Param('id', ParseIntPipe) id: number): Promise<ApiControllerResponse<CompanyWhatsappSettingEntity[]>> {
        const data = await this.companyWhatsappSettingService.findByCompany(id);
        return {
            message: 'Configuraciones de WhatsApp obtenidas de forma exitosa',
            data: data
        };
    }
}

