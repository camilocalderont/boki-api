import { DataSource } from 'typeorm';
import { TagsEntity } from '../../../modules/tags/entities/tags.entity';
export const tagsSeed = async (dataSource: DataSource): Promise<void> => {
    const repository = dataSource.getRepository(TagsEntity);

    // Opcional: Verificar si ya existen datos para evitar problemas al re-ejecutar
    const existingCount = await repository.count();
    if (existingCount > 0) {
        console.log(`Tags already seeded (${existingCount} found). Skipping.`);
        return;
    }

    const tagsData = [
        // IDs reiniciados desde 1
        { Id: 1, VcName: 'reserva' }, { Id: 2, VcName: 'cita' }, { Id: 3, VcName: 'online' },
        { Id: 4, VcName: 'agendar' }, { Id: 5, VcName: 'plataforma web' }, { Id: 6, VcName: 'llamar' },
        { Id: 7, VcName: 'WeiBook' }, { Id: 8, VcName: 'manicura' }, { Id: 9, VcName: 'pedicura' },
        { Id: 10, VcName: 'semipermanente' }, { Id: 11, VcName: 'esmalte gel' }, { Id: 12, VcName: 'duración' },
        { Id: 13, VcName: 'brillo' }, { Id: 14, VcName: 'clásica (manicura/pedicura)' },
        { Id: 15, VcName: 'básica (manicura/pedicura)' }, { Id: 16, VcName: 'limpieza cutículas' },
        { Id: 17, VcName: 'limado' }, { Id: 18, VcName: 'exfoliación' }, { Id: 19, VcName: 'hidratación' },
        { Id: 20, VcName: 'acrílicas' }, { Id: 21, VcName: 'Kapping' }, { Id: 22, VcName: 'baño acrílico' },
        { Id: 23, VcName: 'fortalecer' }, { Id: 24, VcName: 'proteger' }, { Id: 25, VcName: 'uña natural' },
        { Id: 26, VcName: 'esculpidas' }, { Id: 27, VcName: 'alargamiento' }, { Id: 28, VcName: 'moldes' },
        { Id: 29, VcName: 'mantenimiento' }, { Id: 30, VcName: 'relleno' }, { Id: 31, VcName: 'Press On' },
        { Id: 32, VcName: 'extensiones prefabricadas' }, { Id: 33, VcName: 'gel especial' },
        { Id: 34, VcName: 'seguro' }, { Id: 35, VcName: 'profesionales' }, { Id: 36, VcName: 'daño uña' },
        { Id: 37, VcName: 'cuidado' }, { Id: 38, VcName: 'aceite cutículas' }, { Id: 39, VcName: 'guantes' },
        { Id: 40, VcName: 'reparación' }, { Id: 41, VcName: 'uña rota' }, { Id: 42, VcName: 'cejas' },
        { Id: 43, VcName: 'diseño cejas' }, { Id: 44, VcName: 'depilación cera (cejas)' },
        { Id: 45, VcName: 'laminado cejas' }, { Id: 46, VcName: 'tinte cejas' }, { Id: 47, VcName: 'pestañas' },
        { Id: 48, VcName: 'lifting pestañas' }, { Id: 49, VcName: 'extensiones pestañas' },
        { Id: 50, VcName: 'pelo a pelo' }, { Id: 51, VcName: 'punto a punto' }, { Id: 52, VcName: 'tinte pestañas' },
        { Id: 53, VcName: 'política cancelación' }, { Id: 54, VcName: 'reprogramar' }, { Id: 55, VcName: '24 horas' },
        { Id: 56, VcName: 'cargo cancelación' }, { Id: 57, VcName: 'puntualidad' }, { Id: 58, VcName: 'retraso' },
        { Id: 59, VcName: 'pago' }, { Id: 60, VcName: 'efectivo' }, { Id: 61, VcName: 'tarjeta' },
        { Id: 62, VcName: 'transferencia' }, { Id: 63, VcName: 'Nequi' }, { Id: 64, VcName: 'Daviplata' },
        { Id: 65, VcName: 'domicilio' }, { Id: 66, VcName: 'eventos especiales' }, { Id: 67, VcName: 'recomendaciones' },
        { Id: 68, VcName: 'nail art' }, { Id: 69, VcName: 'decoración' }, { Id: 70, VcName: 'precio' },
        { Id: 71, VcName: 'IVA' }, { Id: 72, VcName: 'higiene' }, { Id: 73, VcName: 'esterilización' },
        { Id: 74, VcName: 'preparación cita' }, { Id: 75, VcName: 'ubicación' }, { Id: 76, VcName: 'horario' },
        { Id: 77, VcName: 'contacto' }, { Id: 78, VcName: 'frecuencia pedicura' }, { Id: 79, VcName: 'Gel X' },
        { Id: 80, VcName: 'Rusa Combinada' }, { Id: 81, VcName: 'Spa (Pedicura)' }, { Id: 82, VcName: 'Retiro' }
    ];

    try {
        // Usar insert para insertar o actualizar si fuera necesario (aunque la comprobación inicial evita re-inserción)
        await repository.insert(tagsData);
        console.log(`Tags seeded successfully (${tagsData.length} tags).`);
    } catch (error) {
        console.error('Error seeding Tags:', error);
        throw error; // Re-lanzar para que el runner principal lo capture
    }
};