import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalController } from './controllers/professional.controller';
import { ProfessionalService } from './services/professional.service';
import { ProfessionalEntity } from './entities/professional.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfessionalEntity]),
  ],
  controllers: [ProfessionalController],
  providers: [
    {
      provide: ProfessionalService,
      useClass: ProfessionalService
    }
  ],
  exports: [ProfessionalService],
})
export class ProfessionalModule {}
