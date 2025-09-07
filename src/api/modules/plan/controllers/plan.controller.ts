import { Controller, Inject } from '@nestjs/common';
import { PlanService } from '../services/plan.service';
import { PlanEntity } from '../entities/plan.entity';
import { CreatePlanDto } from '../dto/planCreate.dto';
import { UpdatePlanDto } from '../dto/planUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createPlanSchema } from '../schemas/planCreate.schema';
import { updatePlanSchema } from '../schemas/planUpdate.schema';

@Controller('plans')
export class PlanController extends BaseCrudController<PlanEntity, CreatePlanDto, UpdatePlanDto> {
  constructor(
    @Inject(PlanService)
    private readonly planService: PlanService
  ) {
    super(planService, 'Plan', createPlanSchema, updatePlanSchema);
  }
}