import { Controller, UsePipes, ValidationPipe, Inject } from "@nestjs/common";
import { ProfessionalBussinessHourService } from "../services/professionalBussinessHour.service";
import { ProfessionalBussinessHourEntity } from "../entities/professionalBussinessHour.entity";
import { CreateProfessionalBussinessHourDto } from "../dto/professionalBussinessHourCreate.dto";
import { UpdateProfessionalBussinessHourDto } from "../dto/professionalBussinessHourUpdate.dto";
import { BaseCrudController } from "../../../shared/controllers/crud.controller";
import { createProfessionalBussinessHourSchema } from "../schemas/professionalBussinessHourCreate.schema";
import { updateProfessionalBussinessHourSchema } from "../schemas/professionalBussinessHourUpdate.schema";
import Joi from 'joi';


@Controller('professional-bussiness-hour')
@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true }
}))
export class ProfessionalBussinessHourController extends BaseCrudController<ProfessionalBussinessHourEntity, CreateProfessionalBussinessHourDto, UpdateProfessionalBussinessHourDto> {
    constructor(
        @Inject(ProfessionalBussinessHourService)
        private readonly professionalBussinessHourService: ProfessionalBussinessHourService
    ) {
        super(professionalBussinessHourService, 'ProfessionalBussinessHour', createProfessionalBussinessHourSchema, updateProfessionalBussinessHourSchema);
    }
}