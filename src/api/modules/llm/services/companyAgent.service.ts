import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { CompanyAgentEntity } from "../entities/companyAgent.entity";
import { CreateCompanyAgentDto } from "../dto/createCompanyAgent.dto";
import { UpdateCompanyAgentDto } from "../dto/updateCompanyAgent.dto";

@Injectable()
export class CompanyAgentService extends BaseCrudService<CompanyAgentEntity, CreateCompanyAgentDto, UpdateCompanyAgentDto> {
    constructor(
        @InjectRepository(CompanyAgentEntity)
        private readonly companyAgentRepository: Repository<CompanyAgentEntity>
    ) {
        super(companyAgentRepository);
    }
}