import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { CompanyBranchRoomEntity } from '../entities/companyBranchRoom.entity';
import { CompanyBranchEntity } from '../entities/companyBranch.entity';
import { CreateCompanyBranchRoomDto } from '../dto/companyBranchRoomCreate.dto';
import { UpdateCompanyBranchRoomDto } from '../dto/companyBranchRoomUpdate.dto';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';

@Injectable()
export class CompanyBranchRoomService {
    constructor(
        @InjectRepository(CompanyBranchRoomEntity)
        private readonly companyBranchRoomRepository: Repository<CompanyBranchRoomEntity>,
        @InjectRepository(CompanyBranchEntity)
        private readonly companyBranchRepository: Repository<CompanyBranchEntity>
    ) {
    }

    protected async validateCreate(createCompanyBranchRoomDto: CreateCompanyBranchRoomDto): Promise<void> {
        if (!createCompanyBranchRoomDto.CompanyBranchId) {
            throw new ConflictException(
                [{
                    code: 'ID_DE_SUCURSAL_REQUERIDO',
                    message: 'ID de sucursal es requerido para creación',
                    field: 'CompanyBranchId'
                }],
                'ID de sucursal es requerido para creación'
            );
        }

        if (createCompanyBranchRoomDto.BIsMain) {
            const existingMainRoom = await this.companyBranchRoomRepository.findOne({
                where: {
                    CompanyBranch: { Id: createCompanyBranchRoomDto.CompanyBranchId },
                    BIsMain: true
                }
            });

            if (existingMainRoom) {
                throw new ConflictException(
                    [{
                        code: 'SALA_PRINCIPAL_YA_EXISTE',
                        message: 'Ya existe una sala principal para esta sucursal',
                        field: 'CompanyBranchRooms'
                    }],
                    'Ya existe una sala principal para esta sucursal'
                );
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

    async update(queryRunner: QueryRunner, branchId: number, roomsToUpdate: Array<Partial<CompanyBranchRoomEntity>>): Promise<void> {
        try {
            for (const roomData of roomsToUpdate) {
                await this.validateUpdate(queryRunner, branchId, roomData);
        
                const { Id, ...updatePayload } = roomData;
                
                if (Object.keys(updatePayload).length === 0) {
                    throw new ConflictException(
                        [{
                            code: 'NO_DATOS_PARA_ACTUALIZAR',
                            message: `No hay datos para actualizar para la sala con ID ${Id} en la sucursal ${branchId}`,
                            field: 'CompanyBranchRooms'
                        }],
                        `No hay datos para actualizar para la sala con ID ${Id} en la sucursal ${branchId}`
                    );
                }
                
                const roomEntity = await queryRunner.manager.findOne(CompanyBranchRoomEntity, {
                    where: { Id },
                    relations: ['CompanyBranch']
                });
                
                Object.assign(roomEntity, updatePayload);
                
                await queryRunner.manager.save(roomEntity);
            }
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }
            
            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'SALA_YA_EXISTE',
                        message: 'Ya existe una sala con estos datos',
                        field: 'CompanyBranchRooms'
                    }],
                    'Ya existe una sala con estos datos'
                );
            }

            if (error.code === '23503') {
                throw new BadRequestException([
                    {
                        code: 'SUCURSAL_NO_EXISTE',
                        message: 'La sucursal especificada no existe',
                        field: 'CompanyBranchId'
                    }
                ], 'La sucursal especificada no existe');
            }
            
            throw new BadRequestException(
                [{
                    code: 'ERROR_ACTUALIZACION_SALA',
                    message: `Error al actualizar: ${error.message || 'Error desconocido'}`,
                    field: 'CompanyBranchRooms'
                }],
                'Error al actualizar la sala'
            );
        }
    }

    async delete(queryRunner: QueryRunner, branchId: number, roomIdsToDelete: number[]): Promise<void> {
        for (const roomId of roomIdsToDelete) {
            await this.validateDelete(queryRunner, branchId, roomId);
            
            const roomToDelete = await queryRunner.manager.findOne(CompanyBranchRoomEntity, { 
                where: { Id: roomId }
            });
            
            if (roomToDelete) {
                await queryRunner.manager.remove(roomToDelete);
            }
        }
    }

    public async validateUpdate(queryRunner: QueryRunner, branchId: number, roomData: Partial<CompanyBranchRoomEntity>): Promise<void> {
        const errors: ApiErrorItem[] = [];

        if (!roomData.Id) {
            errors.push({
                code: 'ID_DE_SALA_REQUERIDO',
                message: 'ID de sala requerido para actualización',
                field: 'Id'
            });
        }

        const room = await queryRunner.manager.findOne(CompanyBranchRoomEntity, {
            where: { Id: roomData.Id },
            relations: ['CompanyBranch']
        });

        if (!room) {
            errors.push({
                code: 'SALA_NO_ENCONTRADA',
                message: `Sala con ID ${roomData.Id} no encontrada`,
                field: 'CompanyBranchRooms'
            });
        }

        if (room && room.CompanyBranch && room.CompanyBranch.Id !== branchId) {
            errors.push({
                code: 'SALA_NO_PERTENECE_A_SUCURSAL',
                message: `Sala con ID ${roomData.Id} no pertenece a esta sucursal`,
                field: 'Id'
            });
        }

        if (roomData.BIsMain) {
            const existingMainRoom = await queryRunner.manager.findOne(CompanyBranchRoomEntity, {
                where: { 
                    CompanyBranch: { Id: branchId },
                    BIsMain: true
                }
            });

            if (existingMainRoom && existingMainRoom.Id !== roomData.Id) {
                errors.push({
                    code: 'SOLO_UNA_SALA_PRINCIPAL', 
                    message: 'Ya existe una sala principal en esta sucursal', 
                    field: 'BIsMain'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la validación de sala");
        }
    }

    public async validateDelete(queryRunner: QueryRunner, branchId: number, roomId: number): Promise<void> {
        const errors: ApiErrorItem[] = [];
        const roomToDelete = await queryRunner.manager.findOne(CompanyBranchRoomEntity, { 
             where: { Id: roomId },
             relations: ['CompanyBranch'] 
        });
        
        if (!roomToDelete) {
            errors.push({
                code: 'SALA_NO_ENCONTRADA',
                message: `Sala con ID ${roomId} no encontrada y no puede ser eliminada.`,
                field: `DeleteCompanyBranchRoomIds[${roomId}]`
            });
        }

        if (roomToDelete && roomToDelete.CompanyBranch && roomToDelete.CompanyBranch.Id !== branchId) {
            errors.push({
                code: 'SALA_NO_PERTENECE_A_SUCURSAL',
                message: `Sala con ID ${roomId} no pertenece a la sucursal ${branchId} y no puede ser eliminada.`,
                field: `DeleteCompanyBranchRoomIds[${roomId}]`
            });
        }
        
        if (errors.length > 0) {
            throw new ConflictException(errors, "Error en la eliminación de sala");
        }
    }
}
