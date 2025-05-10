import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './controllers/tags.controller';
import { TagsService } from './services/tags.service';
import { TagsEntity } from './entities/tags.entity';
import { TagsRepository } from './repositories/tags.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagsEntity]),
  ],
  controllers: [TagsController],
  providers: [
    TagsRepository,
    {
      provide: TagsService,
      useClass: TagsService
    }
  ],
  exports: [TagsService],
})
export class TagsModule {}
