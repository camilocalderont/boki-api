import { Controller, Inject, ValidationPipe } from "@nestjs/common";
import { UsePipes } from "@nestjs/common";
import { BaseCrudController } from "~/api/shared/controllers/crud.controller";
import { CompanyAgentEntity } from "../entities/companyAgent.entity";
import { CompanyAgentService } from "../services/companyAgent.service";
import { CreateCompanyAgentDto } from "../dto/createCompanyAgent.dto";
import { UpdateCompanyAgentDto } from "../dto/updateCompanyAgent.dto";
import { createCompanyAgentSchema } from "../schemas/createCompanyAgent.schema";
import { updateCompanyAgentSchema } from "../schemas/updateCompanyAgent.schema";

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
}

