import { DataSource } from 'typeorm';
import { CompanyBranchEntity } from '../../modules/companyBranch/entities/companyBranch.entity';
import { CompanyBranchRoomEntity } from '../../modules/companyBranch/entities/companyBranchRoom.entity';

export const companyBranchRoomSeed = async (dataSource: DataSource): Promise<void> => {
    const companyBranchRepository = dataSource.getRepository(CompanyBranchEntity);
    const companyBranchRoomRepository = dataSource.getRepository(CompanyBranchRoomEntity);
    
    const existingBranches = await companyBranchRepository.find();
    if (existingBranches.length > 0) {
        return;
    }

    const branches = [
        {
            Id: 1,
            CompanyId: 1,
            VcName: "Sede Principal Golden Nails",
            VcDescription: "Sucursal principal de Golden Nails Spa con todos los servicios disponibles",
            VcAddress: "Cll 57bsur #68b-16, Bogotá",
            VcEmail: "sede.principal@goldennailsspa.com",
            VcPhone: "+573121234567",
            VcBranchManagerName: "Laura Martínez",
            VcImage: "https://ejemplo.com/golden_nails_sede.jpg",
            BIsPrincipal: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            Id: 2,
            CompanyId: 1,
            VcName: "Sede Norte Golden Nails",
            VcDescription: "Sucursal de Golden Nails Spa ubicada en el norte de la ciudad",
            VcAddress: "Calle 134 #45-20, Bogotá",
            VcEmail: "sede.norte@goldennailsspa.com",
            VcPhone: "+573121234568",
            VcBranchManagerName: "Patricia Gómez",
            VcImage: "https://ejemplo.com/golden_nails_norte.jpg",
            BIsPrincipal: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    
    await companyBranchRepository.insert(branches);
    
    const rooms = [
        {
            CompanyBranchId: 1,
            VcNumber: "101",
            VcFloor: "Primer piso",
            VcTower: "Área principal",
            VcPhone: "+573121234500",
            VcEmail: "sala101@goldennailsspa.com",
            BIsMain: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            CompanyBranchId: 1,
            VcNumber: "102",
            VcFloor: "Primer piso",
            VcTower: "Área principal",
            VcPhone: "+573121234501",
            VcEmail: "sala102@goldennailsspa.com",
            BIsMain: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        
        {
            CompanyBranchId: 2,
            VcNumber: "201",
            VcFloor: "Segundo piso",
            VcTower: "Torre única",
            VcPhone: "+573121234502",
            VcEmail: "sala201@goldennailsspa.com",
            BIsMain: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            CompanyBranchId: 2,
            VcNumber: "202",
            VcFloor: "Segundo piso",
            VcTower: "Torre única",
            VcPhone: "+573121234503",
            VcEmail: "sala202@goldennailsspa.com",
            BIsMain: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    
    await companyBranchRoomRepository.insert(rooms);
};