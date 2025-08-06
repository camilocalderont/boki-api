import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { CompanyFlowDefinitionEntity } from "../entities/companyFlowDefinition.entity";
import { CreateFlowDto } from "../dto/createFlow.dto";
import { UpdateFlowDto } from "../dto/updateFlow.dto";
import { FlowListResponseDto, FlowListItemDto } from "../dto/flowResponse.dto";

@Injectable()
export class CompanyFlowService extends BaseCrudService<CompanyFlowDefinitionEntity, CreateFlowDto, UpdateFlowDto> {
    constructor(
        @InjectRepository(CompanyFlowDefinitionEntity)
        private readonly companyFlowRepository: Repository<CompanyFlowDefinitionEntity>
    ) {
        super(companyFlowRepository);
    }

    async findByCompany(companyId: number, flowCode?: string, activeOnly?: boolean): Promise<FlowListResponseDto> {
        const queryBuilder = this.companyFlowRepository
            .createQueryBuilder('flow')
            .leftJoinAndSelect('flow.Steps', 'steps')
            .where('flow.CompanyId = :companyId', { companyId })
            .orderBy('flow.created_at', 'DESC')
            .addOrderBy('steps.IStepOrder', 'ASC');

        // Filtro por código de flujo si se proporciona
        if (flowCode) {
            queryBuilder.andWhere('flow.VcFlowName = :flowCode', { flowCode });
        }

        // Filtro por activos solamente
        if (activeOnly) {
            queryBuilder.andWhere('flow.BIsActive = :isActive', { isActive: true });
        }

        const flows = await queryBuilder.getMany();

        // Transformar a DTO de respuesta
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
            total: flowItems.length
        };
    }
}