import { Controller, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentEntity } from '../entities/appointment.entity';
import { CreateAppointmentDto } from '../dto/appointmentCreate.dto';
import { UpdateAppointmentDto } from '../dto/appointmentUpdate.dto';
import { BaseCrudController } from '../../../shared/controllers/crud.controller';
import { createAppointmentSchema } from '../schemas/appointmentCreate.schema';
import { updateAppointmentSchema } from '../schemas/appointmentUpdate.schema';

@Controller('appointments')
@UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true }
}))
export class AppointmentController extends BaseCrudController<AppointmentEntity, CreateAppointmentDto, UpdateAppointmentDto> {
    constructor(
        @Inject(AppointmentService)
        private readonly appointmentService: AppointmentService
    ) {
        super(appointmentService, 'appointments', createAppointmentSchema, updateAppointmentSchema);
    }
}