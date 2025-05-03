import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqsController } from './controllers/faqs.controller';
import { FaqsService } from './services/faqs.service';
import { FaqsEntity } from './entities/faqs.entity';
import { FaqsRepository } from './repositories/faqs.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FaqsEntity]),
  ],
  controllers: [FaqsController],
  providers: [
    FaqsRepository,
    {
      provide: FaqsService,
      useClass: FaqsService
    }
  ],
  exports: [FaqsService],
})
export class FaqsModule {}
