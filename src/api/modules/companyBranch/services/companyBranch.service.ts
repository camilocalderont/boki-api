import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CompanyBranchEntity } from '../entities/companyBranch.entity';
import { CompanyBranchRoomEntity } from '../entities/companyBranchRoom.entity';
import { CreateCompanyBranchDto } from '../dto/companyBranchCreate.dto';
import { UpdateCompanyBranchDto } from '../dto/companyBranchUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { CompanyEntity } from '../../company/entities/company.entity'; 
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';  

@Injectable()
export class CompanyBranchService extends BaseCrudService<CompanyBranchEntity, CreateCompanyBranchDto, UpdateCompanyBranchDto> {
    constructor(
        @InjectRepository(CompanyBranchEntity)
        private readonly companyBranchRepository: Repository<CompanyBranchEntity>,
        @InjectRepository(CompanyEntity)
        private readonly companyRepository: Repository<CompanyEntity>,
        @InjectRepository(CompanyBranchRoomEntity)
        private readonly companyBranchRoomRepository: Repository<CompanyBranchRoomEntity>
    ) {
        super(companyBranchRepository,);
    }

    protected async validateCreate(createCompanyBranchDto: CreateCompanyBranchDto): Promise<void> {
        const errors: ApiErrorItem[] = [];
        const company = await this.companyRepository.findOne({
            where: { Id: createCompanyBranchDto.CompanyId }
        });

        if (!company) {
            errors.push({
                code: 'COMPANY_NOT_FOUND',
                message: 'The specified company does not exist',
                field: 'CompanyId'
            });
        }

        if (createCompanyBranchDto.BIsPrincipal) {
            const existingPrincipal = await this.companyBranchRepository.findOne({
                where: {
                    CompanyId: createCompanyBranchDto.CompanyId,
                    BIsPrincipal: true
                }
            });

            if (existingPrincipal) {
                errors.push({
                    code: 'PRINCIPAL_BRANCH_EXISTS',
                    message: 'A principal branch already exists for this company',
                    field: 'BIsPrincipal'
                });
            }
        }

        if (createCompanyBranchDto.VcEmail) {
            const existingBranch = await this.companyBranchRepository.findOne({
                where: { VcEmail: createCompanyBranchDto.VcEmail }
            });

            if (existingBranch) {
                errors.push({
                    code: 'EMAIL_ALREADY_EXISTS',
                    message: 'This email already exists in the system',
                    field: 'VcEmail'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, 'There is already a branch with these data');
        }
    }

    async create(createCompanyBranchDto: CreateCompanyBranchDto): Promise<CompanyBranchEntity> {
        try {
            await this.validateCreate(createCompanyBranchDto);

            const { CompanyBranchRoom, ...branchData } = createCompanyBranchDto;
            const entity = this.companyBranchRepository.create(branchData);
            const savedEntity = await this.companyBranchRepository.save(entity);

            if (CompanyBranchRoom) {
                const roomEntities = [];
                for (const roomItem of CompanyBranchRoom) {
                    const roomData = {
                        ...roomItem,
                        CompanyBranchId: savedEntity.Id
                    };

                    const roomEntity = this.companyBranchRoomRepository.create({
                        ...roomData,
                        CompanyBranch: savedEntity
                    });

                    const savedRoom = await this.companyBranchRoomRepository.save(roomEntity);
                    roomEntities.push(savedRoom);
                }
                (savedEntity as any).CompanyBranchRooms = roomEntities;
            }
            await this.afterCreate(savedEntity);
            return savedEntity;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: '23505',
                        message: 'A branch with this data already exists',
                        field: 'companyBranch'
                    }],
                    'A branch with this data already exists'
                );
            }

            if (error.code === '23503') {
                throw new BadRequestException(
                    [{
                        code: '23505',
                        message: `Company with ID ${createCompanyBranchDto.CompanyId} does not exist`,
                        field: 'companyBranch'
                    }],
                    'Company does not exist'
                );
            }

            throw new BadRequestException('An unexpected error occurred', error);
        }
    }

    protected async validateUpdate(id: number, updateCompanyBranchDto: UpdateCompanyBranchDto): Promise<void> {
        try {
            const branch = await this.findOne(id);
            const errors: ApiErrorItem[] = [];

            if (updateCompanyBranchDto.CompanyId && updateCompanyBranchDto.CompanyId !== branch.CompanyId) {
                const company = await this.companyRepository.findOne({
                    where: { Id: updateCompanyBranchDto.CompanyId }
                });

                if (!company) {
                    errors.push({
                        code: 'COMPANY_NOT_FOUND',
                        message: 'The specified company does not exist',
                        field: 'CompanyId'
                    });
                }
            }

            if (updateCompanyBranchDto.BIsPrincipal && !branch.BIsPrincipal) {
                const companyId = updateCompanyBranchDto.CompanyId || branch.CompanyId;
                const existingPrincipal = await this.companyBranchRepository.findOne({
                    where: {
                        CompanyId: companyId,
                        BIsPrincipal: true,
                        Id: Not(id)
                    }
                });

                if (existingPrincipal) {
                    errors.push({
                        code: 'PRINCIPAL_BRANCH_EXISTS',
                        message: 'A principal branch already exists for this company',
                        field: 'BIsPrincipal'
                    });
                }
            }

            if (updateCompanyBranchDto.VcEmail && updateCompanyBranchDto.VcEmail !== branch.VcEmail) {
                const existingBranch = await this.companyBranchRepository.findOne({
                    where: { VcEmail: updateCompanyBranchDto.VcEmail }
                });

                if (existingBranch) {
                    errors.push({
                        code: 'EMAIL_ALREADY_EXISTS',
                        message: 'This email already exists in the system',
                        field: 'VcEmail'
                    });
                }
            }

            // Validar las salas a actualizar si existen
            if (updateCompanyBranchDto.CompanyBranchRooms && updateCompanyBranchDto.CompanyBranchRooms.length > 0) {
                for (const room of updateCompanyBranchDto.CompanyBranchRooms) {
                    if (!room.Id) {
                        errors.push({
                            code: 'ROOM_ID_REQUIRED',
                            message: 'Room ID is required for updating existing rooms',
                            field: 'CompanyBranchRooms'
                        });
                        continue;
                    }

                    // Verificar si la sala existe y pertenece a esta sucursal
                    const existingRoom = await this.companyBranchRoomRepository.findOne({
                        where: { Id: room.Id }
                    });

                    if (!existingRoom) {
                        errors.push({
                            code: 'ROOM_NOT_FOUND',
                            message: `Room with ID ${room.Id} does not exist`,
                            field: 'CompanyBranchRooms'
                        });
                        continue;
                    }

                    if (existingRoom.CompanyBranch && existingRoom.CompanyBranch.Id !== id) {
                        errors.push({
                            code: 'ROOM_NOT_BELONGS_TO_BRANCH',
                            message: `Room with ID ${room.Id} does not belong to this branch`,
                            field: 'CompanyBranchRooms'
                        });
                    }
                }
            }

            if (errors.length > 0) {
                throw new ConflictException(errors, 'Validation failed for branch update');
            }
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new BadRequestException(`Error validating branch with ID ${id}: ${error.message}`);
        }
    }

    async update(id: number, updateCompanyBranchDto: UpdateCompanyBranchDto): Promise<CompanyBranchEntity> {
        try {
            await this.validateUpdate(id, updateCompanyBranchDto);
            
            // Extraer datos de salas si existen
            const { CompanyBranchRooms, NewCompanyBranchRooms, DeleteCompanyBranchRoomIds, ...branchData } = updateCompanyBranchDto;
            
            // Actualizar la sucursal primero
            // Usamos el método update del servicio base, pero primero guardamos los datos originales
            await super.update(id, branchData);
            const updatedBranch = await this.findOne(id);
            
            // Actualizar salas existentes si se proporcionaron
            if (CompanyBranchRooms && CompanyBranchRooms.length > 0) {
                for (const room of CompanyBranchRooms) {
                    if (room.Id) {
                        await this.companyBranchRoomRepository.update(room.Id, room);
                    }
                }
            }
            
            // Crear nuevas salas si se proporcionaron
            if (NewCompanyBranchRooms && NewCompanyBranchRooms.length > 0) {
                const newRooms = [];
                
                for (const roomData of NewCompanyBranchRooms) {
                    // Preparamos los datos para la nueva sala con la relación correcta
                    const roomToCreate: any = {
                        ...roomData,
                        CompanyBranch: updatedBranch
                    };
                    
                    // Creamos la entidad
                    const newRoom = this.companyBranchRoomRepository.create(roomToCreate);
                    
                    const savedRoom = await this.companyBranchRoomRepository.save(newRoom);
                    newRooms.push(savedRoom);
                }
                
                // Añadir las nuevas salas a la respuesta
                (updatedBranch as any).NewCompanyBranchRooms = newRooms;
            }
            
            // Eliminar salas si se proporcionaron IDs para eliminar
            if (DeleteCompanyBranchRoomIds && DeleteCompanyBranchRoomIds.length > 0) {
                for (const roomId of DeleteCompanyBranchRoomIds) {
                    // Verificar si la sala pertenece a esta sucursal antes de eliminarla
                    const room = await this.companyBranchRoomRepository.findOne({
                        where: { Id: roomId },
                        relations: ['CompanyBranch']
                    });
                    
                    if (room && room.CompanyBranch.Id === updatedBranch.Id) {
                        await this.companyBranchRoomRepository.remove(room);
                    }
                }
            }
            
            // Obtener todas las salas actuales para incluirlas en la respuesta
            const currentRooms = await this.companyBranchRoomRepository.find({
                where: { CompanyBranch: { Id: updatedBranch.Id } }
            });
            
            (updatedBranch as any).CompanyBranchRooms = currentRooms;
            
            return updatedBranch;
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: '23505',
                        message: 'A branch with this data already exists',
                        field: 'companyBranch'
                    }],
                    'A branch with this data already exists'
                );
            }

            if (error.code === '23503') {
                throw new BadRequestException(
                    [{
                        code: '23503',
                        message: 'The specified company does not exist',
                        field: 'CompanyId'
                    }],
                    'The specified company does not exist'
                );
            }

            throw new BadRequestException('An unexpected error occurred', error);
        }
    }

    async findByCompany(companyId: number): Promise<any> {
        const company = await this.companyRepository.findOne({
            where: { Id: companyId }
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${companyId} not found`);
        }

        const branches = await this.companyBranchRepository.find({
            where: { CompanyId: companyId }
        });

        if (!branches || branches.length === 0) {
            throw new NotFoundException(`No branches found for company with ID ${companyId}`);
        }

        return {
            company: {
                Id: company.Id,
                VcName: company.VcName,
                VcLogo: company.VcLogo
            },
            branches: branches.map(branch => ({
                Id: branch.Id,
                VcName: branch.VcName,
                VcDescription: branch.VcDescription,
                VcAddress: branch.VcAddress,
                VcEmail: branch.VcEmail,
                VcPhone: branch.VcPhone,
                VcBranchManagerName: branch.VcBranchManagerName,
                VcImage: branch.VcImage,
                BIsPrincipal: branch.BIsPrincipal,
                created_at: branch.created_at,
                updated_at: branch.updated_at
            }))
        };
    }

    async findPrincipalByCompany(companyId: number): Promise<any> {
        const company = await this.companyRepository.findOne({
            where: { Id: companyId }
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${companyId} not found`);
        }

        const branch = await this.companyBranchRepository.findOne({
            where: {
                CompanyId: companyId,
                BIsPrincipal: true
            }
        });

        if (!branch) {
            throw new NotFoundException(`No principal branch found for company with ID ${companyId}`);
        }

        return {
            company: {
                Id: company.Id,
                VcName: company.VcName,
                VcLogo: company.VcLogo
            },
            branch: {
                Id: branch.Id,
                VcName: branch.VcName,
                VcDescription: branch.VcDescription,
                VcAddress: branch.VcAddress,
                VcEmail: branch.VcEmail,
                VcPhone: branch.VcPhone,
                VcBranchManagerName: branch.VcBranchManagerName,
                VcImage: branch.VcImage,
                BIsPrincipal: branch.BIsPrincipal,
                created_at: branch.created_at,
                updated_at: branch.updated_at
            }
        };
    }
}
