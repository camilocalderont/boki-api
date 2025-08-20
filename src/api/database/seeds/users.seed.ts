import { DataSource } from 'typeorm';
import { UsersEntity } from '../../modules/users/entities/users.entity';
import * as bcrypt from 'bcrypt';

export const userSeed = async (dataSource: DataSource): Promise<void> => {
    const userRepository = dataSource.getRepository(UsersEntity);
    
    // Verificar si ya existen datos
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
        return;
    }

    // Hashear passwords para los usuarios de prueba
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('admin456', 10);
    const hashedPassword3 = await bcrypt.hash('user789', 10);

    const users = [
        {
            Id: 1,
            VcIdentificationNumber: '12345678',
            VcPhone: '3001234567',
            VcNickName: 'Ana',
            VcFirstName: 'Ana María',
            VcSecondName: 'Isabel',
            VcFirstLastName: 'Rodríguez',
            VcSecondLastName: 'Castro',
            VcEmail: 'ana.rodriguez@goldennailsspa.com',
            VcPassword: hashedPassword1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            Id: 2,
            VcIdentificationNumber: '87654321',
            VcPhone: '3009876543',
            VcNickName: 'Carlos',
            VcFirstName: 'Carlos',
            VcSecondName: 'Eduardo',
            VcFirstLastName: 'González',
            VcSecondLastName: 'Pérez',
            VcEmail: 'carlos.gonzalez@beautysalon.com',
            VcPassword: hashedPassword2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        {
            Id: 3,
            VcIdentificationNumber: '11223344',
            VcPhone: '3005678901',
            VcNickName: 'Maria',
            VcFirstName: 'María',
            VcSecondName: 'Fernanda',
            VcFirstLastName: 'López',
            VcSecondLastName: 'Martínez',
            VcEmail: 'maria.lopez@relaxspa.com',
            VcPassword: hashedPassword3,
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