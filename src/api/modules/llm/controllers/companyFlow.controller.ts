import { Controller, Inject, ValidationPipe, UsePipes, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe, HttpCode, HttpStatus } from "@nestjs/common";
import { CompanyFlowDefinitionEntity } from "../entities/companyFlowDefinition.entity";
import { CompanyFlowService } from "../services/companyFlow.service";
import { CreateFlowDto } from "../dto/createFlow.dto";
import { UpdateFlowDto, UpdateStepDto } from "../dto/updateFlow.dto";
import { FlowStepDto } from "../dto/flowComponents.dto";
import { createFlowCompleteSchema, updateFlowCompleteSchema } from "../schemas/createFlowComplete.schema";
import { ApiControllerResponse } from "~/api/shared/interfaces/api-response.interface";
import { FlowResponseDto, FlowListResponseDto, FlowStepResponseDto } from "../dto/flowResponse.dto";

@Controller('companyFlow')
@UsePipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true }
}))
export class CompanyFlowController { //extends BaseCrudController<CompanyFlowDefinitionEntity, CreateFlowDto, UpdateFlowDto> {
    constructor(
        @Inject(CompanyFlowService)
        private readonly companyFlowService: CompanyFlowService
    ) {
        //super(companyFlowService, 'companyFlow', createFlowCompleteSchema, updateFlowCompleteSchema);
    }

    @Post(':companyId/flows')
    @HttpCode(HttpStatus.CREATED)
    async createFlow(
        @Param('companyId', ParseIntPipe) companyId: number,
        @Body() createFlowDto: CreateFlowDto
    ): Promise<ApiControllerResponse<FlowResponseDto>> {
        const data = await this.companyFlowService.createFlowComplete(companyId, createFlowDto);
        return {
            message: 'Flujo creado exitosamente',
            data: data
        };
    }

    @Get(':companyId/flows')
    @HttpCode(HttpStatus.OK)
    async getFlowsByCompany(
        @Param('companyId', ParseIntPipe) companyId: number,
        @Query('flow_code') flowCode?: string
    ): Promise<ApiControllerResponse<FlowListResponseDto>> {
        const data = await this.companyFlowService.getFlowsByCompany(companyId, flowCode);
        return {
            message: 'Flujos obtenidos exitosamente',
            data: data
        };
    }

    @Get(':companyId/flows/:flowId')
    @HttpCode(HttpStatus.OK)
    async getFlowComplete(
        @Param('companyId', ParseIntPipe) companyId: number,
        @Param('flowId', ParseIntPipe) flowId: number
    ): Promise<ApiControllerResponse<FlowResponseDto>> {
        const data = await this.companyFlowService.getFlowComplete(companyId, flowId);
        return {
            message: 'Flujo obtenido exitosamente',
            data: data
        };
    }

    @Put(':companyId/flows/:flowId')
    @HttpCode(HttpStatus.OK)
    async updateFlow(
        @Param('companyId', ParseIntPipe) companyId: number,
        @Param('flowId', ParseIntPipe) flowId: number,
        @Body() updateFlowDto: UpdateFlowDto
    ): Promise<ApiControllerResponse<FlowResponseDto>> {
        const data = await this.companyFlowService.updateFlowComplete(companyId, flowId, updateFlowDto);
        return {
            message: 'Flujo actualizado exitosamente',
            data: data
        };
    }

    @Put(':companyId/flows/:flowId/steps/:stepId')
    @HttpCode(HttpStatus.OK)
    async updateFlowStep(
        @Param('companyId', ParseIntPipe) companyId: number,
        @Param('flowId', ParseIntPipe) flowId: number,
        @Param('stepId', ParseIntPipe) stepId: number,
        @Body() updateStepDto: UpdateStepDto
    ): Promise<ApiControllerResponse<FlowStepResponseDto>> {
        const data = await this.companyFlowService.updateFlowStep(companyId, flowId, stepId, updateStepDto);
        return {
            message: 'Paso del flujo actualizado exitosamente',
            data: data
        };
    }

    @Post(':companyId/flows/:flowId/steps')
    @HttpCode(HttpStatus.CREATED)
    async createFlowStep(
        @Param('companyId', ParseIntPipe) companyId: number,
        @Param('flowId', ParseIntPipe) flowId: number,
        @Body() stepDto: FlowStepDto
    ): Promise<ApiControllerResponse<FlowStepResponseDto>> {
        const data = await this.companyFlowService.createFlowStep(companyId, flowId, stepDto);
        return {
            message: 'Paso del flujo creado exitosamente',
            data: data
        };
    }

    @Delete(':companyId/flows/:flowId')
    @HttpCode(HttpStatus.OK)
    async deleteFlow(
        @Param('companyId', ParseIntPipe) companyId: number,
        @Param('flowId', ParseIntPipe) flowId: number
    ): Promise<ApiControllerResponse<{ deleted: boolean }>> {
        await this.companyFlowService.deleteFlowComplete(companyId, flowId);
        return {
            message: 'Flujo eliminado exitosamente',
            data: { deleted: true }
        };
    }
}