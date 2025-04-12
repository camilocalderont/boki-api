import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from './entities/service.entity';
import { ServiceService } from './services/service.service';
import { ServiceController } from './controllers/service.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity])
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService]
})
export class ServiceModule {}
