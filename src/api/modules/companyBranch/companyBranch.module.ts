import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyBranchController } from './controllers/companyBranch.controller';
import { CompanyBranchService } from './services/companyBranch.service';
import { CompanyBranchRoomService } from './services/companyBranchRoom.service';
import { CompanyBranchEntity } from './entities/companyBranch.entity';
import { CompanyBranchRoomEntity } from './entities/companyBranchRoom.entity';
import { CompanyEntity } from '../company/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyBranchEntity, CompanyBranchRoomEntity, CompanyEntity]),
  ],
  controllers: [CompanyBranchController],
  providers: [
    {
      provide: CompanyBranchService,
      useClass: CompanyBranchService
    },
    {
      provide: CompanyBranchRoomService,
      useClass: CompanyBranchRoomService
    }
  ],
  exports: [CompanyBranchService, CompanyBranchRoomService],
})
export class CompanyBranchModule {}
