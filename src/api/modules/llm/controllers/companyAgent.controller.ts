import { Controller, Inject, ValidationPipe, Get, Param, ParseIntPipe, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { UsePipes } from "@nestjs/common";
import { BaseCrudController } from "~/api/shared/controllers/crud.controller";
import { CompanyAgentEntity } from "../entities/companyAgent.entity";
import { CompanyAgentService } from "../services/companyAgent.service";
import { CreateCompanyAgentDto } from "../dto/createCompanyAgent.dto";
import { UpdateCompanyAgentDto } from "../dto/updateCompanyAgent.dto";
import { LlmCompanyAgentDto } from "../dto/llmCompanyAgent.dto";
import { createCompanyAgentSchema } from "../schemas/createCompanyAgent.schema";
import { updateCompanyAgentSchema } from "../schemas/updateCompanyAgent.schema";
import { ApiControllerResponse } from "~/api/shared/interfaces/api-response.interface";

@Controller('companyAgent')
@UsePipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true }
}))
export class CompanyAgentController extends BaseCrudController<CompanyAgentEntity, CreateCompanyAgentDto, UpdateCompanyAgentDto> {
    constructor(
        @Inject(CompanyAgentService)
        private readonly companyAgentService: CompanyAgentService
    ) {
        super(companyAgentService, 'companyAgent', createCompanyAgentSchema, updateCompanyAgentSchema);
    }

    @Get('company/:id')
    @HttpCode(HttpStatus.OK)
    async findByCompany(
        @Param('id', ParseIntPipe) id: number,
        @Query('VcAgentName') vcAgentName?: string
    ): Promise<ApiControllerResponse<CompanyAgentEntity[]>> {
        const data = await this.companyAgentService.findByCompany(id, vcAgentName);
        return {
            message: 'Agentes de empresa obtenidos de forma exitosa',
            data: data
        };
    }

    @Get('llm/company/:id')
    @HttpCode(HttpStatus.OK)
    async findByCompanyForLlm(
        @Param('id', ParseIntPipe) id: number,
        @Query('VcAgentName') vcAgentName?: string
    ): Promise<ApiControllerResponse<LlmCompanyAgentDto[]>> {
        const data = await this.companyAgentService.findByCompanyForLlm(id, vcAgentName);
        return {
            message: 'Agentes de empresa obtenidos de forma exitosa',
            data: data
        };
    }
}

