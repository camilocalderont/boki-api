import { DataSource } from 'typeorm';
import { FaqsTagsEntity } from '../../modules/faqs/entities/faqs-tags.entity'; // Ajusta la ruta a tu entidad FaqsTags

// Helper function para mapear IDs viejos (101+) a nuevos (1+)
const mapOldTagIdToNew = (oldId: number): number => oldId - 100;

export const faqsTagsSeed = async (dataSource: DataSource): Promise<void> => {
    const repository = dataSource.getRepository(FaqsTagsEntity);

    // Considera limpiar la tabla antes de insertar, especialmente si los mapeos cambian
    try {
        const existingCount = await repository.count();
        if (existingCount > 0) {
            console.log(`Faqs_Tags already populated (${existingCount} relations). Clearing table before seeding.`);
            await repository.clear(); // Elimina todas las relaciones existentes
        }
    } catch (error) {
        console.error('Error checking/clearing Faqs_Tags table:', error);
        throw error;
    }


    // Mapeo de FaqId a sus *NUEVOS* TagsIds (IDs 1-82)
    const faqsTagsMapping = [
        { FaqsId: 1, TagsIds: [1, 2, 3, 4, 5, 6, 7] },
        { FaqsId: 2, TagsIds: [8, 10, 11, 12, 13] },
        { FaqsId: 3, TagsIds: [8, 10, 12] },
        { FaqsId: 4, TagsIds: [8, 14, 15, 16, 17, 18, 19, 10] },
        { FaqsId: 5, TagsIds: [9, 15, 16, 17, 18, 19, 10] },
        { FaqsId: 6, TagsIds: [9, 81, 18, 19, 16, 17] },
        { FaqsId: 7, TagsIds: [8, 20, 21, 22, 23, 24, 25, 10] },
        { FaqsId: 8, TagsIds: [8, 20, 21, 22, 26, 27, 28, 25] },
        { FaqsId: 9, TagsIds: [8, 20, 29, 30, 12] },
        { FaqsId: 10, TagsIds: [8, 31, 79, 32, 33, 27, 10] },
        { FaqsId: 11, TagsIds: [8, 31, 79, 12, 37] },
        { FaqsId: 12, TagsIds: [8, 31, 79, 34, 35, 36, 25] },
        { FaqsId: 13, TagsIds: [8, 20, 29, 30, 82, 10] },
        { FaqsId: 14, TagsIds: [37, 38, 39, 67, 8, 9, 10, 20, 31] },
        { FaqsId: 15, TagsIds: [40, 41, 36, 2, 77] },
        { FaqsId: 16, TagsIds: [42, 43, 44, 45, 46] },
        { FaqsId: 17, TagsIds: [47, 48, 52, 49, 50, 51] },
        { FaqsId: 18, TagsIds: [47, 48, 12] },
        { FaqsId: 19, TagsIds: [1, 2, 53, 54, 55, 56] },
        { FaqsId: 20, TagsIds: [2, 57, 58, 53, 54] },
        { FaqsId: 21, TagsIds: [59, 60, 61, 62, 63, 64] },
        { FaqsId: 22, TagsIds: [65, 66, 1] },
        { FaqsId: 23, TagsIds: [1, 4, 35, 3] },
        { FaqsId: 24, TagsIds: [75, 76, 77, 5, 7] },
        { FaqsId: 25, TagsIds: [72, 73, 34] },
        { FaqsId: 26, TagsIds: [74, 8, 10, 20, 31] },
        { FaqsId: 27, TagsIds: [9, 78, 37] },
        { FaqsId: 28, TagsIds: [70, 71, 59] },
        { FaqsId: 29, TagsIds: [68, 69, 70, 8, 9] },
        { FaqsId: 30, TagsIds: [82, 20, 10, 31, 79, 36, 25] },
        { FaqsId: 31, TagsIds: [8, 80, 16, 35] },
    ];

    // Aplanar la data para insertar en la tabla Faqs_Tags
    const faqsTagsDataToInsert: { FaqsId: number, TagsId: number }[] = [];
    for (const mapping of faqsTagsMapping) {
        for (const tagId of mapping.TagsIds) {
            faqsTagsDataToInsert.push({ FaqsId: mapping.FaqsId, TagsId: tagId });
        }
    }

    try {
        // Insertar todas las relaciones Faqs <-> Tags
        // Usar insert es eficiente aquí, especialmente después de limpiar la tabla
        await repository.insert(faqsTagsDataToInsert);
        console.log(`Faqs_Tags relations seeded successfully (${faqsTagsDataToInsert.length} relations).`);
    } catch (error) {
        console.error('Error seeding Faqs_Tags:', error);
        throw error; // Re-lanzar
    }
};