import { DataSource } from 'typeorm';
import { ClientEntity } from '../../modules/client/entities/client.entity';

export const clientSeed = async (dataSource: DataSource): Promise<void> => {
    const clientRepository = dataSource.getRepository(ClientEntity);
    
    const existingClients = await clientRepository.find();
    if (existingClients.length > 0) {
        return;
    }

    const clients = [
        {
            Id: 1,
            VcFirstName: "Laura",
            VcFirstLastName: "García",
            VcSecondLastName: "Martínez",
            VcIdentificationType: "CC",
            VcIdentificationNumber: "1098765430",
            VcEmail: "laura.garcia@example.com",
            VcPhone: "3001112233",
            CompanyId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            Id: 2,
            VcFirstName: "Carlos",
            VcFirstLastName: "Rodríguez",
            VcSecondLastName: "Sánchez",
            VcIdentificationType: "CC",
            VcIdentificationNumber: "1098765429",
            VcEmail: "carlos.rodriguez@example.com",
            VcPhone: "3001112234",
            CompanyId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            Id: 3,
            VcFirstName: "Ana",
            VcFirstLastName: "Morales",
            VcSecondLastName: "Torres",
            VcIdentificationType: "CC",
            VcIdentificationNumber: "1098765428",
            VcEmail: "ana.morales@example.com",
            VcPhone: "3001112235",
            CompanyId: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];
    
    await clientRepository.insert(clients);
};