import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from './entities/service.entity';
import { ServiceStageEntity } from './entities/serviceStage.entity';
import { ServiceService } from './services/service.service';
import { ServiceStageService } from './services/serviceStage.service';
import { ServiceController } from './controllers/service.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity, ServiceStageEntity])
  ],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceStageService],
  exports: [ServiceService, ServiceStageService]
})
export class ServiceModule {}
