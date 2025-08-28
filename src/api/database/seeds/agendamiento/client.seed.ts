import { DataSource } from 'typeorm';
import { ClientEntity } from '../../../modules/client/entities/client.entity';

export const clientSeed = async (dataSource: DataSource): Promise<void> => {
    const clientRepository = dataSource.getRepository(ClientEntity);

    const existingClients = await clientRepository.find();
    if (existingClients.length > 0) {
        return;
    }

    const clients = [
        {
            VcFirstName: "Laura",
            VcFirstLastName: "García",
            VcSecondLastName: "Martínez",
            VcIdentificationNumber: "1098765430",
            VcEmail: "laura.garcia@example.com",
            VcPhone: "3001112233",
            CompanyId: 1
        },
        {
            VcFirstName: "Carlos",
            VcFirstLastName: "Rodríguez",
            VcSecondLastName: "Sánchez",
            VcIdentificationNumber: "1098765429",
            VcEmail: "carlos.rodriguez@example.com",
            VcPhone: "3001112234",
            CompanyId: 1
        },
        {
            VcFirstName: "Ana",
            VcFirstLastName: "Morales",
            VcSecondLastName: "Torres",
            VcIdentificationNumber: "1098765428",
            VcEmail: "ana.morales@example.com",
            VcPhone: "3001112235",
            CompanyId: 1
        }
    ];

    await clientRepository.insert(clients);
};