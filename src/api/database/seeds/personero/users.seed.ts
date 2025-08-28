import { DataSource } from 'typeorm';
import { UsersEntity } from '../../../modules/users/entities/users.entity';
import * as bcrypt from 'bcrypt';

export const userSeed = async (dataSource: DataSource): Promise<void> => {
    const userRepository = dataSource.getRepository(UsersEntity);

    // Verificar si ya existen datos
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
        return;
    }

    // Hashear passwords para los usuarios de prueba
    const hashedPassword1 = await bcrypt.hash('mesitas', 10);

    const users = [
        {
            Id: 1,
            VcIdentificationNumber: '12345678',
            VcPhone: '3102636788',
            VcNickName: 'Carlos Enciso',
            VcFirstName: 'Carlos Enciso',
            VcSecondName: 'Navarro',
            VcFirstLastName: 'Navarro',
            VcSecondLastName: '',
            VcEmail: 'personeria@elcolegio-cundinamarca.gov.co',
            VcPassword: hashedPassword1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ];

    try {
        await userRepository.insert(users);
        console.log(`Users seeded successfully (${users.length} users).`);
    } catch (error) {
        console.error('Error seeding Users:', error);
        throw error;
    }
};