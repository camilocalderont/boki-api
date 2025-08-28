import { DataSource } from 'typeorm';
import { CategoryServiceEntity } from '../../../modules/categoryService/entities/categoryService.entity';

export const categoryServiceSeed = async (dataSource: DataSource): Promise<void> => {
    const repository = dataSource.getRepository(CategoryServiceEntity);

    // Opcional: Verificar si ya existen datos para evitar duplicados al re-ejecutar
    const existingCount = await repository.count();
    if (existingCount > 0) {
        console.log('CategoryService already seeded. Skipping.');
        return;
    }


    const categoriesData = [
        { Id: 1, VcName: 'Derechos de niños, niñas y adolescentes', BIsService: true, CompanyId: 1 },
        { Id: 2, VcName: 'Violencia intrafamiliar o de género', BIsService: true, CompanyId: 1 },
        { Id: 3, VcName: 'Problemas de convivencia ciudadana', BIsService: true, CompanyId: 1 },
        { Id: 4, VcName: 'Derechos al trabajo (quejas laborales)', BIsService: true, CompanyId: 1 },
        { Id: 5, VcName: 'Servicios públicos (agua, luz, salud, etc.)', BIsService: true, CompanyId: 1 },
        { Id: 6, VcName: 'Presentar queja, petición o tutela', BIsService: true, CompanyId: 1 },
        { Id: 7, VcName: 'Información general de la Personería', BIsService: true, CompanyId: 1 },
    ];

    try {
        await repository.insert(categoriesData);
        console.log('CategoryService seeded successfully.');
    } catch (error) {
        console.error('Error seeding CategoryService:', error);
        throw error; // Re-lanzar el error para que el runner principal lo capture
    }
};