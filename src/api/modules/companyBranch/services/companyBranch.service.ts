import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, QueryRunner, Not, In, DataSource } from 'typeorm';
import { CompanyBranchEntity } from '../entities/companyBranch.entity';
import { CompanyBranchRoomEntity } from '../entities/companyBranchRoom.entity';
import { CreateCompanyBranchDto } from '../dto/companyBranchCreate.dto';
import { UpdateCompanyBranchDto } from '../dto/companyBranchUpdate.dto';
import { BaseCrudService } from '../../../shared/services/crud.services';
import { CompanyEntity } from '../../company/entities/company.entity';
import { ApiErrorItem } from '~/api/shared/interfaces/api-response.interface';
import { CompanyBranchRoomService } from './companyBranchRoom.service';

@Injectable()
export class CompanyBranchService extends BaseCrudService<CompanyBranchEntity, CreateCompanyBranchDto, UpdateCompanyBranchDto> {
    constructor(
        @InjectRepository(CompanyBranchEntity)
        private readonly companyBranchRepository: Repository<CompanyBranchEntity>,
        @InjectRepository(CompanyEntity)
        private readonly companyRepository: Repository<CompanyEntity>,
        @InjectRepository(CompanyBranchRoomEntity)
        private readonly companyBranchRoomRepository: Repository<CompanyBranchRoomEntity>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @Inject(forwardRef(() => CompanyBranchRoomService))
        private readonly companyBranchRoomService: CompanyBranchRoomService
    ) {
        super(companyBranchRepository);
    }

    async findOne(id: number): Promise<CompanyBranchEntity> {
        try {
            const entity = await this.companyBranchRepository.findOne({
                where: { Id: id }
            });

            if (!entity) {
                throw new NotFoundException([
                    {
                        code: 'SUCURSAL_NO_ENCONTRADA',
                        message: `Sucursal con ID ${id} no encontrada`,
                        field: 'Id'
                    }
                ]);
            }

            const rooms = await this.companyBranchRoomRepository.find({
                where: { CompanyBranch: { Id: id } }
            });

            (entity as any).CompanyBranchRooms = rooms;

            return entity;
        } catch (error) {
            if (error instanceof NotFoundException ||
                error instanceof BadRequestException ||
                error instanceof ConflictException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException([
                    {
                        code: 'ERROR_CONSULTA_SUCURSAL',
                        message: 'Error al consultar la sucursal',
                        field: 'Id'
                    }
                ]);
            }

            throw new BadRequestException([
                {
                    code: 'ERROR_CONSULTA_SUCURSAL',
                    message: `Error al consultar la sucursal: ${error.message}`,
                    field: 'Id'
                }
            ]);
        }
    }

    protected async validateCreate(createCompanyBranchDto: CreateCompanyBranchDto): Promise<void> {
        const errors: ApiErrorItem[] = [];
        const company = await this.companyRepository.findOne({
            where: { Id: createCompanyBranchDto.CompanyId }
        });

        if (!company) {
            errors.push({
                code: 'COMPAÑIA_NO_ENCONTRADA',
                message: 'La empresa especificada no existe',
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
                    code: 'SUCURSAL_PRINCIPAL_YA_EXISTE',
                    message: 'Ya existe una sucursal principal para esta empresa',
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
                    code: 'CORREO_YA_EXISTE',
                    message: 'Este correo electrónico ya existe en el sistema',
                    field: 'VcEmail'
                });
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, 'Ya existe una sucursal con estos datos');
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
                        code: 'SUCURSAL_YA_EXISTE',
                        message: 'Ya existe una sucursal con estos datos',
                        field: 'companyBranch'
                    }],
                    'Ya existe una sucursal con estos datos'
                );
            }

            if (error.code === '23503') {
                throw new ConflictException(
                    [{
                        code: 'EMPRESA_NO_EXISTE',
                        message: `Empresa con ID ${createCompanyBranchDto.CompanyId} no existe`,
                        field: 'CompanyId'
                    }],
                    'Empresa no existe'
                );
            }

            throw new BadRequestException('Ocurrió un error inesperado', error.message || error);
        }
    }

    protected async validateUpdate(id: number, updateCompanyBranchDto: UpdateCompanyBranchDto): Promise<void> {
        const branch = await this.findOne(id);
        const errors: ApiErrorItem[] = [];

        if (updateCompanyBranchDto.CompanyId && updateCompanyBranchDto.CompanyId !== branch.CompanyId) {
            const company = await this.companyRepository.findOne({
                where: { Id: updateCompanyBranchDto.CompanyId }
            });

            if (!company) {
                errors.push({
                    code: 'EMPRESA_NO_EXISTE',
                    message: 'La empresa especificada no existe',
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
                    code: 'SUCURSAL_PRINCIPAL_YA_EXISTE',
                    message: 'Ya existe una sucursal principal para esta empresa',
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
                    code: 'CORREO_YA_EXISTE',
                    message: 'Este correo electrónico ya existe en el sistema',
                    field: 'VcEmail'
                });
            }
        }

        if (updateCompanyBranchDto.BIsPrincipal === false && branch.BIsPrincipal) {
            const other = await this.companyBranchRepository.findOne({
                where: { CompanyId: branch.CompanyId, BIsPrincipal: true, Id: Not(id) }
            });
            if (!other) {
                errors.push({
                    code: 'SIN_SUCURSAL_PRINCIPAL',
                    message: 'Debe existir al menos una sucursal principal en la empresa',
                    field: 'BIsPrincipal'
                });
            }
        }

        if (updateCompanyBranchDto.CompanyBranchRooms !== undefined) {
            if (updateCompanyBranchDto.CompanyBranchRooms.length === 0) {
                errors.push({
                    code: 'SIN_SALAS',
                    message: 'Una sucursal debe tener al menos una sala asociada',
                    field: 'CompanyBranchRooms'
                });
            } else {
                const hasPrincipalRoom = updateCompanyBranchDto.CompanyBranchRooms.some(room => room.BIsMain === true);
                if (!hasPrincipalRoom) {
                    errors.push({
                        code: 'SIN_SALA_PRINCIPAL',
                        message: 'Debe existir al menos una sala principal en la sucursal',
                        field: 'CompanyBranchRooms'
                    });
                }

                const principalRooms = updateCompanyBranchDto.CompanyBranchRooms.filter(room => room.BIsMain === true);
                if (principalRooms.length > 1) {
                    errors.push({
                        code: 'MULTIPLE_SALAS_PRINCIPALES',
                        message: 'Solo puede existir una sala principal por sucursal',
                        field: 'CompanyBranchRooms'
                    });
                }

                const emails = updateCompanyBranchDto.CompanyBranchRooms
                    .filter(room => room.VcEmail && room.VcEmail.trim() !== '')
                    .map(room => room.VcEmail.toLowerCase());

                if (new Set(emails).size !== emails.length) {
                    errors.push({
                        code: 'CORREOS_SALAS_DUPLICADOS',
                        message: 'Existen correos electrónicos duplicados entre las salas',
                        field: 'CompanyBranchRooms'
                    });
                }

                const roomNumbers = updateCompanyBranchDto.CompanyBranchRooms
                    .filter(room => room.VcNumber && room.VcNumber.trim() !== '')
                    .map(room => room.VcNumber.trim());

                if (new Set(roomNumbers).size !== roomNumbers.length) {
                    errors.push({
                        code: 'NUMEROS_SALAS_DUPLICADOS',
                        message: 'Existen números de sala duplicados',
                        field: 'CompanyBranchRooms'
                    });
                }
            }
        }

        if (errors.length > 0) {
            throw new ConflictException(errors, 'Error en la validación para la actualización de la sucursal');
        }
    }

    async update(id: number, updateCompanyBranchDto: UpdateCompanyBranchDto): Promise<CompanyBranchEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.validateUpdate(id, updateCompanyBranchDto);

            const {
                CompanyBranchRooms,
                ...branchData
            } = updateCompanyBranchDto;

            const existingBranch = await queryRunner.manager.findOne(CompanyBranchEntity, {
                where: { Id: id }
            });

            Object.assign(existingBranch, branchData);
            await queryRunner.manager.save(existingBranch);

            if (CompanyBranchRooms !== undefined) {
                const existingRooms = await this.companyBranchRoomRepository.find({
                    where: { CompanyBranch: { Id: id } }
                });

                const existingRoomIds = existingRooms.map(room => room.Id);
                const providedRoomIds = CompanyBranchRooms
                    .filter(room => room.Id !== undefined)
                    .map(room => room.Id);

                const roomsToDeleteIds = existingRoomIds.filter(roomId => !providedRoomIds.includes(roomId));

                if (roomsToDeleteIds.length > 0) {
                    await queryRunner.manager.delete(CompanyBranchRoomEntity, {
                        Id: In(roomsToDeleteIds),
                        CompanyBranch: { Id: id }
                    });
                }

                for (const roomData of CompanyBranchRooms) {
                    if (roomData.Id) {
                        const { Id, ...updateData } = roomData;
                        const existingRoom = await queryRunner.manager.findOne(CompanyBranchRoomEntity, {
                            where: { Id, CompanyBranch: { Id: id } }
                        });

                        if (existingRoom) {
                            Object.assign(existingRoom, updateData);
                            await queryRunner.manager.save(existingRoom);
                        }
                    } else {
                        const newRoom = queryRunner.manager.create(CompanyBranchRoomEntity, {
                            ...roomData,
                            CompanyBranch: existingBranch
                        });

                        await queryRunner.manager.save(newRoom);
                    }
                }
            }

            await queryRunner.commitTransaction();

            const updatedBranch = await this.companyBranchRepository.findOne({
                where: { Id: id }
            });

            const rooms = await this.companyBranchRoomRepository.find({
                where: { CompanyBranch: { Id: id } }
            });

            (updatedBranch as any).CompanyBranchRooms = rooms;

            return updatedBranch;

        } catch (error) {
            await queryRunner.rollbackTransaction();

            if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
                throw error;
            }

            if (error.code === '23505') {
                throw new ConflictException(
                    [{
                        code: 'SUCURSAL_YA_EXISTE',
                        message: 'Ya existe una sucursal con estos datos',
                        field: 'companyBranch'
                    }],
                    'Ya existe una sucursal con estos datos'
                );
            }

            throw new BadRequestException(error, 'Error al actualizar la sucursal y sus salas');
        } finally {
            await queryRunner.release();
        }
    }

    async findByCompany(companyId: number): Promise<any> {
        const company = await this.companyRepository.findOne({
            where: { Id: companyId }
        });

        if (!company) {
            throw new ConflictException(
                [{
                    code: 'COMPAÑIA_NO_ENCONTRADA',
                    message: 'La empresa especificada no existe',
                    field: 'CompanyId'
                }],
                'La empresa especificada no existe'
            );
        }

        const branches = await this.companyBranchRepository.find({
            where: { CompanyId: companyId }
        });

        if (!branches || branches.length === 0) {
            throw new ConflictException(
                [{
                    code: 'SUCURSAL_NO_ENCONTRADA',
                    message: 'No se encontraron sucursales para la empresa especificada',
                    field: 'branches'
                }],
                'No se encontraron sucursales para la empresa especificada'
            );
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
            throw new ConflictException(
                [{
                    code: 'COMPAÑIA_NO_ENCONTRADA',
                    message: 'La empresa especificada no existe',
                    field: 'CompanyId'
                }],
                'La empresa especificada no existe'
            );
        }

        const branch = await this.companyBranchRepository.findOne({
            where: {
                CompanyId: companyId,
                BIsPrincipal: true
            }
        });

        if (!branch) {
            throw new ConflictException(
                [{
                    code: 'SUCURSAL_PRINCIPAL_NO_ENCONTRADA',
                    message: 'No se encontró la sucursal principal para la empresa especificada',
                    field: 'branch'
                }],
                'No se encontró la sucursal principal para la empresa especificada'
            );
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
