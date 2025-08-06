import { Controller, Inject, ValidationPipe, Get, Param, ParseIntPipe, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { UsePipes } from "@nestjs/common";
import { BaseCrudController } from "~/api/shared/controllers/crud.controller";
import { CompanyFlowDefinitionEntity } from "../entities/companyFlowDefinition.entity";
import { CompanyFlowService } from "../services/companyFlow.service";
import { CreateFlowDto } from "../dto/createFlow.dto";
import { UpdateFlowDto } from "../dto/updateFlow.dto";
import { createFlowCompleteSchema } from "../schemas/createFlowComplete.schema";
import { updateFlowCompleteSchema } from "../schemas/createFlowComplete.schema";
import { ApiControllerResponse } from "~/api/shared/interfaces/api-response.interface";
import { FlowListResponseDto } from "../dto/flowResponse.dto";

@Controller('companyFlow')
@UsePipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true }
}))
export class CompanyFlowController extends BaseCrudController<CompanyFlowDefinitionEntity, CreateFlowDto, UpdateFlowDto> {
    constructor(
        @Inject(CompanyFlowService)
        private readonly companyFlowService: CompanyFlowService
    ) {
        super(companyFlowService, 'companyFlow', createFlowCompleteSchema, updateFlowCompleteSchema);
    }

    @Get('company/:id')
    @HttpCode(HttpStatus.OK)
    async findByCompany(
        @Param('id', ParseIntPipe) id: number,
        @Query('flow_code') flowCode?: string,
        @Query('active_only') activeOnly?: boolean
    ): Promise<ApiControllerResponse<FlowListResponseDto>> {
        const data = await this.companyFlowService.findByCompany(id, flowCode, activeOnly);
        return {
            message: 'Flujos de empresa obtenidos de forma exitosa',
            data: data
        };
    }
}