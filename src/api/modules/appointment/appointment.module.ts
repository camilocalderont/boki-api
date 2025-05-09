import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from './entities/appointment.entity';
import { AppointmentStateEntity } from './entities/appointmentState.entity';
import { AppointmentStageEntity } from './entities/appointmentStage.entity';
import { StateEntity } from './entities/state.entity';
import { AppointmentService } from './services/appointment.service';
import { AppointmentStateService } from './services/appointmentState.service';
import { AppointmentStageService } from './services/appointmentStage.service';
import { AppointmentController } from './controllers/appointment.controller';

import { ClientEntity } from '../client/entities/client.entity';
import { ServiceEntity } from '../service/entities/service.entity';
import { ProfessionalEntity } from '../professional/entities/professional.entity';
import { ProfessionalServiceEntity } from '../professional/entities/professionalService.entity';
import { ProfessionalBussinessHourEntity } from '../professional/entities/professionalBussinessHour.entity';
import { ServiceStageEntity } from '../service/entities/serviceStage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AppointmentEntity,
      AppointmentStateEntity,
      AppointmentStageEntity,
      StateEntity,
      ClientEntity,
      ServiceEntity,
      ProfessionalEntity,
      ProfessionalServiceEntity,
      ProfessionalBussinessHourEntity,
      ServiceStageEntity
    ])
  ],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    AppointmentStateService,
    AppointmentStageService
  ],
  exports: [
    AppointmentService,
    AppointmentStateService,
    AppointmentStageService
  ]
})
export class AppointmentModule {}
