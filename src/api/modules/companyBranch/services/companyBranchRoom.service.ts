import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyBranchRoomEntity } from '../entities/companyBranchRoom.entity';
import { CompanyBranchEntity } from '../entities/companyBranch.entity';
import { CreateCompanyBranchRoomDto } from '../dto/companyBranchRoomCreate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';

@Injectable()
export class CompanyBranchRoomService extends BaseCrudService<CompanyBranchRoomEntity, CreateCompanyBranchRoomDto, any> {
    constructor(
        @InjectRepository(CompanyBranchRoomEntity)
        private readonly companyBranchRoomRepository: Repository<CompanyBranchRoomEntity>,
        @InjectRepository(CompanyBranchEntity)
        private readonly companyBranchRepository: Repository<CompanyBranchEntity>
    ) {
        super(companyBranchRoomRepository);
    }

    protected async validateCreate(createCompanyBranchRoomDto: CreateCompanyBranchRoomDto): Promise<void> {
        if (!createCompanyBranchRoomDto.CompanyBranchId) {
            throw new BadRequestException('CompanyBranchId Does not exist');
        }

        if (createCompanyBranchRoomDto.BIsMain) {
            const existingMainRoom = await this.companyBranchRoomRepository.findOne({
                where: {
                    CompanyBranch: { Id: createCompanyBranchRoomDto.CompanyBranchId },
                    BIsMain: true
                }
            });

            if (existingMainRoom) {
                throw new ConflictException('A principal room already exists for this branch');
            }
        }
    }

    async create(createCompanyBranchRoomDto: CreateCompanyBranchRoomDto): Promise<CompanyBranchRoomEntity> {
        try {
            await this.validateCreate(createCompanyBranchRoomDto);
            
            const branch = await this.companyBranchRepository.findOne({
                where: { Id: createCompanyBranchRoomDto.CompanyBranchId }
            });
            
            if (!branch) {
                throw new NotFoundException(`The specified branch does not exist`);
            }
            
            const entity = this.companyBranchRoomRepository.create({
                ...createCompanyBranchRoomDto,
                CompanyBranch: branch
            });
            
            const savedEntity = await this.companyBranchRoomRepository.save(entity);
            
            return savedEntity;
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException('A room with this data already exists');
            }

            if (error.code === '23503') {
                throw new BadRequestException(`The specified branch does not exist`);
            }

            console.error('Error en create CompanyBranchRoom:', error);
            throw error;
        }
    }

    async findByBranch(branchId: number): Promise<CompanyBranchRoomEntity[]> {
        const branch = await this.companyBranchRepository.findOne({
            where: { Id: branchId }
        });
        
        if (!branch) {
            throw new NotFoundException(`The specified branch does not exist`);
        }
        
        const rooms = await this.companyBranchRoomRepository.find({
            where: { CompanyBranch: { Id: branchId } },
            relations: ['CompanyBranch']
        });
        
        if (!rooms || rooms.length === 0) {
            return [];
        }
        
        return rooms;
    }
}
