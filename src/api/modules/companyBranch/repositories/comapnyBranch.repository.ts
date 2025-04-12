import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyBranchRoomDto } from '../dto/companyBranchRoomCreate.dto';
import { CompanyBranchRoomEntity } from '../entities/companyBranchRoom.entity';

@Injectable()
export class CompanyBranchRoomRepository {
    constructor(
        @InjectRepository(CompanyBranchRoomEntity)
        private readonly companyBranchRoomRepository: Repository<CompanyBranchRoomEntity>,
    ) {}
    
    async create(CreateCompanyBranchRoomDto: CreateCompanyBranchRoomDto): Promise<CompanyBranchRoomEntity> {
        const companyBranchRoom = this.companyBranchRoomRepository.create(CreateCompanyBranchRoomDto);
        return await this.companyBranchRoomRepository.save(companyBranchRoom);
    }
}
