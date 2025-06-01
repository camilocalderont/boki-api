import { DataSource } from 'typeorm';
import { CategoryServiceEntity } from '../../modules/categoryService/entities/categoryService.entity';

export const categoryServiceSeed = async (dataSource: DataSource): Promise<void> => {
    const repository = dataSource.getRepository(CategoryServiceEntity);

    // Opcional: Verificar si ya existen datos para evitar duplicados al re-ejecutar
    const existingCount = await repository.count();
    if (existingCount > 0) {
        console.log('CategoryService already seeded. Skipping.');
        return;
    }

    const categoriesData = [
        { VcName: 'Manicure', BIsService: true, CompanyId: 1 },
        { VcName: 'Pedicure', BIsService: true, CompanyId: 1 },
        { VcName: 'Combos (otros)', BIsService: true, CompanyId: 1 },
        { VcName: 'Pestañas y cejas', BIsService: true, CompanyId: 1 },
        { VcName: 'General / Reservas', BIsService: false, CompanyId: 1 },
        { VcName: 'Políticas / Pagos', BIsService: false, CompanyId: 1 },
    ];

    try {
        await repository.insert(categoriesData);
        console.log('CategoryService seeded successfully.');
    } catch (error) {
        console.error('Error seeding CategoryService:', error);
        throw error; // Re-lanzar el error para que el runner principal lo capture
    }
};