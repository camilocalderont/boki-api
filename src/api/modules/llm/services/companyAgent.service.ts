import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { CompanyAgentEntity } from "../entities/companyAgent.entity";
import { CreateCompanyAgentDto } from "../dto/createCompanyAgent.dto";
import { UpdateCompanyAgentDto } from "../dto/updateCompanyAgent.dto";
import { LlmCompanyAgentDto } from "../dto/llmCompanyAgent.dto";

@Injectable()
export class CompanyAgentService extends BaseCrudService<CompanyAgentEntity, CreateCompanyAgentDto, UpdateCompanyAgentDto> {
    constructor(
        @InjectRepository(CompanyAgentEntity)
        private readonly companyAgentRepository: Repository<CompanyAgentEntity>
    ) {
        super(companyAgentRepository);
    }

    async findByCompany(companyId: number, agentName?: string): Promise<CompanyAgentEntity[]> {
        const whereCondition: any = { CompanyId: companyId };
        
        if (agentName) {
            whereCondition.VcAgentName = agentName;
        }

        return this.companyAgentRepository.find({
            where: whereCondition,
            relations: ['Company']
        });
    }

    async findByCompanyForLlm(companyId: number, agentName?: string): Promise<LlmCompanyAgentDto[]> {
        const queryBuilder = this.companyAgentRepository
            .createQueryBuilder('agent')
            .select([
                'agent.CompanyId',
                'agent.VcAgentName', 
                'agent.TxPromptTemplate',
                'agent.BIsActive',
                'agent.VcModelName',
                'agent.VcRepoId',
                'agent.VcFilename',
                'agent.VcLocalName',
                'agent.DcTemperature',
                'agent.IMaxTokens',
                'agent.DcTopP',
                'agent.ITopK',
                'agent.IContextLength',
                'agent.TxStopTokens',
                'agent.IMaxMemoryMb',
                'agent.INThreads',
                'agent.BlsUseGpu'
            ])
            .where('agent.CompanyId = :companyId', { companyId });

        if (agentName) {
            queryBuilder.andWhere('agent.VcAgentName = :agentName', { agentName });
        }

        return queryBuilder.getMany();
    }
}