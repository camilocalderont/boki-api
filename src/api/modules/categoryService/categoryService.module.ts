import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryServiceEntity } from './entities/categoryService.entity';
import { CategoryServiceRepository } from './repositories/categoryService.repository';
import { CategoryServiceService } from './services/categoryService.service';
import { CategoryServiceController } from './controllers/categoryService.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryServiceEntity])
    ],
    providers: [
        CategoryServiceRepository,
        CategoryServiceService
    ],
    controllers: [
        CategoryServiceController
    ],
    exports: [
        CategoryServiceService
    ]
})
export class CategoryServiceModule {}
