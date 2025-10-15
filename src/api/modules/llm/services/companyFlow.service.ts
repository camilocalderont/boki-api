import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { CompanyFlowDefinitionEntity } from '../entities/companyFlowDefinition.entity';
import { CompanyFlowStepEntity } from '../entities/companyFlowStep.entity';
import { CompanyFlowConditionEntity } from '../entities/companyFlowCondition.entity';
import { CompanyFlowToolEntity } from '../entities/companyFlowTool.entity';
import { CreateFlowDto } from '../dto/createFlow.dto';
import { UpdateFlowDto, UpdateStepDto } from '../dto/updateFlow.dto';
import { FlowStepDto } from '../dto/flowComponents.dto';
import { FlowResponseDto, FlowListResponseDto, FlowListItemDto, FlowStepResponseDto } from '../dto/flowResponse.dto';

@Injectable()
export class CompanyFlowService extends BaseCrudService<CompanyFlowDefinitionEntity, CreateFlowDto, UpdateFlowDto> {
    constructor(
        @InjectRepository(CompanyFlowDefinitionEntity)
        private readonly flowDefinitionRepository: Repository<CompanyFlowDefinitionEntity>,
        
        @InjectRepository(CompanyFlowStepEntity)
        private readonly flowStepRepository: Repository<CompanyFlowStepEntity>,
        
        @InjectRepository(CompanyFlowConditionEntity)
        private readonly flowConditionRepository: Repository<CompanyFlowConditionEntity>,
        
        @InjectRepository(CompanyFlowToolEntity)
        private readonly flowToolRepository: Repository<CompanyFlowToolEntity>,
        
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) {
        super(flowDefinitionRepository);
    }

    async createFlowComplete(companyId: number, createFlowDto: CreateFlowDto): Promise<FlowResponseDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const existingFlow = await this.flowDefinitionRepository.findOne({
                where: { 
                    CompanyId: companyId,
                    VcFlowName: createFlowDto.vc_flow_name
                }
            });
            
            if (existingFlow) {
                throw new ConflictException(`Ya existe un flujo con el nombre '${createFlowDto.vc_flow_name}' para esta compañía`);
            }
            
            const flowDefinition = queryRunner.manager.create(CompanyFlowDefinitionEntity, {
                CompanyId: companyId,
                VcFlowName: createFlowDto.vc_flow_name,
                VcDisplayName: createFlowDto.vc_display_name,
                VcDescription: createFlowDto.vc_description,
                TxSystemPrompt: createFlowDto.tx_system_prompt,
                TxUserPromptTemplate: createFlowDto.tx_user_prompt_template,
                JsonFlowConfig: createFlowDto.json_flow_config,
                JsonLLMConfig: createFlowDto.json_llm_config,
                BIsActive: createFlowDto.b_is_active ?? true
            });
            
            const savedFlowDefinition = await queryRunner.manager.save(flowDefinition);
            
            if (createFlowDto.steps && createFlowDto.steps.length > 0) {
                const steps = createFlowDto.steps.map(stepDto => 
                    queryRunner.manager.create(CompanyFlowStepEntity, {
                        FlowDefinitionId: savedFlowDefinition.Id,
                        VcStepKey: stepDto.vc_step_key,
                        VcStepName: stepDto.vc_step_name,
                        IStepOrder: stepDto.i_step_order,
                        TxExecutionCondition: stepDto.tx_execution_condition,
                        TxStepOutput: stepDto.tx_step_output,
                        JsonExpectedData: stepDto.json_expected_data,
                        JsonStepConfig: stepDto.json_step_config,
                        BIsActive: stepDto.b_is_active ?? true
                    })
                );
                await queryRunner.manager.save(steps);
            }
            
            if (createFlowDto.conditions && createFlowDto.conditions.length > 0) {
                const conditions = createFlowDto.conditions.map(conditionDto =>
                    queryRunner.manager.create(CompanyFlowConditionEntity, {
                        FlowDefinitionId: savedFlowDefinition.Id,
                        VcConditionKey: conditionDto.vc_condition_key,
                        VcConditionName: conditionDto.vc_condition_name,
                        TxConditionExpression: conditionDto.tx_condition_expression,
                        VcConditionType: conditionDto.vc_condition_type,
                        BIsActive: conditionDto.b_is_active ?? true
                    })
                );
                await queryRunner.manager.save(conditions);
            }
            
            if (createFlowDto.tools && createFlowDto.tools.length > 0) {
                const tools = createFlowDto.tools.map(toolDto =>
                    queryRunner.manager.create(CompanyFlowToolEntity, {
                        FlowDefinitionId: savedFlowDefinition.Id,
                        VcToolType: toolDto.vc_tool_type,
                        VcToolName: toolDto.vc_tool_name,
                        JsonToolConfig: toolDto.json_tool_config,
                        TxUsageCondition: toolDto.tx_usage_condition,
                        BIsActive: toolDto.b_is_active ?? true
                    })
                );
                await queryRunner.manager.save(tools);
            }
            
            await queryRunner.commitTransaction();
            
            // 5. Retornar el flujo completo creado
            return await this.getFlowComplete(companyId, savedFlowDefinition.Id);
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error creating flow complete:', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getFlowsByCompany(companyId: number, flowCode?: string): Promise<FlowListResponseDto> {
        const whereCondition: any = { CompanyId: companyId };
        
        if (flowCode) {
            whereCondition.VcFlowName = flowCode;
        }
        
        const [flows, total] = await this.flowDefinitionRepository.findAndCount({
            where: whereCondition,
            relations: ['Steps'],
            order: { created_at: 'DESC' }
        });
        
        const flowItems: FlowListItemDto[] = flows.map(flow => ({
            id: flow.Id,
            vc_flow_name: flow.VcFlowName,
            vc_display_name: flow.VcDisplayName,
            vc_description: flow.VcDescription,
            b_is_active: flow.BIsActive,
            created_at: flow.created_at.toISOString(),
            steps_count: flow.Steps?.length || 0
        }));
        
        return {
            flows: flowItems,
            total: total
        };
    }

    async getFlowComplete(companyId: number, flowId: number): Promise<FlowResponseDto> {
        const flow = await this.flowDefinitionRepository.findOne({
            where: { Id: flowId, CompanyId: companyId },
            relations: ['Steps', 'Conditions', 'Tools']
        });
        
        if (!flow) {
            throw new NotFoundException(`Flujo con ID ${flowId} no encontrado para la compañía ${companyId}`);
        }
        
        return {
            id: flow.Id,
            company_id: flow.CompanyId,
            vc_flow_name: flow.VcFlowName,
            vc_display_name: flow.VcDisplayName,
            vc_description: flow.VcDescription,
            tx_system_prompt: flow.TxSystemPrompt,
            tx_user_prompt_template: flow.TxUserPromptTemplate,
            json_flow_config: flow.JsonFlowConfig,
            json_llm_config: flow.JsonLLMConfig,
            b_is_active: flow.BIsActive,
            created_at: flow.created_at.toISOString(),
            updated_at: flow.updated_at.toISOString(),
            steps: flow.Steps?.sort((a, b) => a.IStepOrder - b.IStepOrder).map(step => ({
                id: step.Id,
                vc_step_key: step.VcStepKey,
                vc_step_name: step.VcStepName,
                i_step_order: step.IStepOrder,
                tx_execution_condition: step.TxExecutionCondition,
                tx_step_output: step.TxStepOutput,
                json_expected_data: step.JsonExpectedData,
                json_step_config: step.JsonStepConfig,
                b_is_active: step.BIsActive,
                created_at: step.created_at.toISOString(),
                updated_at: step.updated_at.toISOString()
            })) || [],
            conditions: flow.Conditions?.map(condition => ({
                id: condition.Id,
                vc_condition_key: condition.VcConditionKey,
                vc_condition_name: condition.VcConditionName,
                tx_condition_expression: condition.TxConditionExpression,
                vc_condition_type: condition.VcConditionType,
                b_is_active: condition.BIsActive,
                created_at: condition.created_at.toISOString()
            })) || [],
            tools: flow.Tools?.map(tool => ({
                id: tool.Id,
                vc_tool_type: tool.VcToolType,
                vc_tool_name: tool.VcToolName,
                json_tool_config: tool.JsonToolConfig,
                tx_usage_condition: tool.TxUsageCondition,
                b_is_active: tool.BIsActive,
                created_at: tool.created_at.toISOString()
            })) || []
        };
    }

    async updateFlowComplete(companyId: number, flowId: number, updateFlowDto: UpdateFlowDto): Promise<FlowResponseDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const existingFlow = await this.flowDefinitionRepository.findOne({
                where: { Id: flowId, CompanyId: companyId }
            });
            
            if (!existingFlow) {
                throw new NotFoundException(`Flujo con ID ${flowId} no encontrado para la compañía ${companyId}`);
            }
            
            const updateData: Partial<CompanyFlowDefinitionEntity> = {};
            
            if (updateFlowDto.vc_flow_name !== undefined) updateData.VcFlowName = updateFlowDto.vc_flow_name;
            if (updateFlowDto.vc_display_name !== undefined) updateData.VcDisplayName = updateFlowDto.vc_display_name;
            if (updateFlowDto.vc_description !== undefined) updateData.VcDescription = updateFlowDto.vc_description;
            if (updateFlowDto.tx_system_prompt !== undefined) updateData.TxSystemPrompt = updateFlowDto.tx_system_prompt;
            if (updateFlowDto.tx_user_prompt_template !== undefined) updateData.TxUserPromptTemplate = updateFlowDto.tx_user_prompt_template;
            if (updateFlowDto.json_flow_config !== undefined) updateData.JsonFlowConfig = updateFlowDto.json_flow_config;
            if (updateFlowDto.json_llm_config !== undefined) updateData.JsonLLMConfig = updateFlowDto.json_llm_config;
            if (updateFlowDto.b_is_active !== undefined) updateData.BIsActive = updateFlowDto.b_is_active;
            
            if (Object.keys(updateData).length > 0) {
                await queryRunner.manager.update(CompanyFlowDefinitionEntity, { Id: flowId }, updateData);
            }
            
            await queryRunner.commitTransaction();
            
            return await this.getFlowComplete(companyId, flowId);
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error updating flow complete:', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateFlowStep(companyId: number, flowId: number, stepId: number, updateStepDto: UpdateStepDto): Promise<FlowStepResponseDto> {
        await this.validateFlowExists(companyId, flowId);
        
        const existingStep = await this.flowStepRepository.findOne({
            where: { Id: stepId, FlowDefinitionId: flowId }
        });
        
        if (!existingStep) {
            throw new NotFoundException(`Paso con ID ${stepId} no encontrado en el flujo ${flowId}`);
        }
        
        const updateData: Partial<CompanyFlowStepEntity> = {};
        
        if (updateStepDto.vc_step_key !== undefined) updateData.VcStepKey = updateStepDto.vc_step_key;
        if (updateStepDto.vc_step_name !== undefined) updateData.VcStepName = updateStepDto.vc_step_name;
        if (updateStepDto.i_step_order !== undefined) updateData.IStepOrder = updateStepDto.i_step_order;
        if (updateStepDto.tx_execution_condition !== undefined) updateData.TxExecutionCondition = updateStepDto.tx_execution_condition;
        if (updateStepDto.tx_step_output !== undefined) updateData.TxStepOutput = updateStepDto.tx_step_output;
        if (updateStepDto.json_expected_data !== undefined) updateData.JsonExpectedData = updateStepDto.json_expected_data;
        if (updateStepDto.json_step_config !== undefined) updateData.JsonStepConfig = updateStepDto.json_step_config;
        if (updateStepDto.b_is_active !== undefined) updateData.BIsActive = updateStepDto.b_is_active;
        
        if (Object.keys(updateData).length > 0) {
            await this.flowStepRepository.update(stepId, updateData);
        }
        
        const updatedStep = await this.flowStepRepository.findOne({ where: { Id: stepId } });
        
        return {
            id: updatedStep.Id,
            vc_step_key: updatedStep.VcStepKey,
            vc_step_name: updatedStep.VcStepName,
            i_step_order: updatedStep.IStepOrder,
            tx_execution_condition: updatedStep.TxExecutionCondition,
            tx_step_output: updatedStep.TxStepOutput,
            json_expected_data: updatedStep.JsonExpectedData,
            json_step_config: updatedStep.JsonStepConfig,
            b_is_active: updatedStep.BIsActive,
            created_at: updatedStep.created_at.toISOString(),
            updated_at: updatedStep.updated_at.toISOString()
        };
    }

    async createFlowStep(companyId: number, flowId: number, stepDto: FlowStepDto): Promise<FlowStepResponseDto> {
        await this.validateFlowExists(companyId, flowId);
        
        const newStep = this.flowStepRepository.create({
            FlowDefinitionId: flowId,
            VcStepKey: stepDto.vc_step_key,
            VcStepName: stepDto.vc_step_name,
            IStepOrder: stepDto.i_step_order,
            TxExecutionCondition: stepDto.tx_execution_condition,
            TxStepOutput: stepDto.tx_step_output,
            JsonExpectedData: stepDto.json_expected_data,
            JsonStepConfig: stepDto.json_step_config,
            BIsActive: stepDto.b_is_active ?? true
        });
        
        const savedStep = await this.flowStepRepository.save(newStep);
        
        return {
            id: savedStep.Id,
            vc_step_key: savedStep.VcStepKey,
            vc_step_name: savedStep.VcStepName,
            i_step_order: savedStep.IStepOrder,
            tx_execution_condition: savedStep.TxExecutionCondition,
            tx_step_output: savedStep.TxStepOutput,
            json_expected_data: savedStep.JsonExpectedData,
            json_step_config: savedStep.JsonStepConfig,
            b_is_active: savedStep.BIsActive,
            created_at: savedStep.created_at.toISOString(),
            updated_at: savedStep.updated_at.toISOString()
        };
    }

    async deleteFlowComplete(companyId: number, flowId: number): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            await this.validateFlowExists(companyId, flowId);
            
            await queryRunner.manager.delete(CompanyFlowDefinitionEntity, { Id: flowId, CompanyId: companyId });
            
            await queryRunner.commitTransaction();
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error deleting flow complete:', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private async validateFlowExists(companyId: number, flowId: number): Promise<void> {
        const flow = await this.flowDefinitionRepository.findOne({
            where: { Id: flowId, CompanyId: companyId }
        });
        
        if (!flow) {
            throw new NotFoundException(`Flujo con ID ${flowId} no encontrado para la compañía ${companyId}`);
        }
    }
}