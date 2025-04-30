import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalController } from './controllers/professional.controller';
import { ProfessionalService } from './services/professional.service';
import { ProfessionalBussinessHourService } from './services/professionalBussinessHour.service';
import { ProfessionalServiceService } from './services/professionalService.service';
import { ProfessionalEntity } from './entities/professional.entity';
import { ProfessionalBussinessHourEntity } from './entities/professionalBussinessHour.entity';
import { ProfessionalServiceEntity } from './entities/professionalService.entity';
import { CompanyBranchRoomEntity } from '../companyBranch/entities/companyBranchRoom.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProfessionalEntity,
      ProfessionalBussinessHourEntity,
      ProfessionalServiceEntity,
      CompanyBranchRoomEntity
    ])
  ],
  controllers: [ProfessionalController],
  providers: [
    ProfessionalService,
    ProfessionalBussinessHourService,
    ProfessionalServiceService
  ],
  exports: [ProfessionalService],
})
export class ProfessionalModule {}
