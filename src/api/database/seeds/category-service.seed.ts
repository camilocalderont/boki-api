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
        // IDs explícitos si quieres controlar las FKs en otros seeders
        { Id: 1, VcName: 'Manicure', BIsService: true },
        { Id: 2, VcName: 'Pedicure', BIsService: true },
        { Id: 3, VcName: 'Combos (otros)', BIsService: true },
        { Id: 4, VcName: 'Pestañas y cejas', BIsService: true },
        { Id: 5, VcName: 'General / Reservas', BIsService: false },
        { Id: 6, VcName: 'Políticas / Pagos', BIsService: false },
    ];

    try {
        await repository.save(categoriesData);
        console.log('CategoryService seeded successfully.');
    } catch (error) {
        console.error('Error seeding CategoryService:', error);
        throw error; // Re-lanzar el error para que el runner principal lo capture
    }
};