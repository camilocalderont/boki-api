import { DataSource } from 'typeorm';
import { FaqsEntity } from '../../modules/faqs/entities/faqs.entity'; // Ajusta la ruta a tu entidad Faqs

export const faqsSeed = async (dataSource: DataSource): Promise<void> => {
    const repository = dataSource.getRepository(FaqsEntity);

    // Opcional: Verificar si ya existen datos
    const existingCount = await repository.count();
    if (existingCount > 0) {
        console.log(`Faqs already seeded (${existingCount} found). Skipping.`);
        return;
    }

    // Datos de las FAQs fusionadas (asegúrate que CompanyId=1 exista)
    const faqsData = [
        // Asegúrate que los CategoryServiceId (1-6) y CompanyId=1 existan previamente
        { Id: 1, CompanyId: 1, CategoryServiceId: 5, VcQuestion: '¿Cómo puedo agendar una cita?', VcAnswer: 'Puedes agendar tu cita fácilmente a través de Whatsapp, llamando directamente al salón o usando la aplicación de reservas BokiBot.' },
        { Id: 2, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿Qué es el servicio de manicure semipermanente?', VcAnswer: 'Es un servicio de esmaltado a base de gel que ofrece una duración prolongada de aproximadamente 3 semanas, manteniendo un brillo y color perfectos.' },
        { Id: 3, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿Cuánto tiempo dura el esmalte semipermanente?', VcAnswer: 'Tiene una duración aproximada de 3 semanas, dependiendo del cuidado y el crecimiento natural de la uña.' },
        { Id: 4, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿Qué incluye el servicio de manicure básico/clásico?', VcAnswer: 'Incluye limpieza de cutículas, limado de uñas, exfoliación suave, hidratación y esmaltado tradicional o semipermanente según tu elección.' },
        { Id: 5, CompanyId: 1, CategoryServiceId: 2, VcQuestion: '¿Ofrecen servicio de pedicure? ¿Qué incluye el básico?', VcAnswer: 'Sí, ofrecemos pedicure completo. El básico incluye limpieza, limado, tratamiento de cutículas, exfoliación ligera, hidratación y esmaltado (tradicional o semipermanente).' },
        { Id: 6, CompanyId: 1, CategoryServiceId: 2, VcQuestion: '¿Qué incluye la Pedicura Spa?', VcAnswer: 'Incluye todos los pasos de la pedicura básica más una exfoliación profunda, mascarilla hidratante y un masaje relajante más extenso para una experiencia completa de cuidado y relajación.' },
        { Id: 7, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿Qué es el servicio de Kapping / Baño de acrílico?', VcAnswer: 'Es un procedimiento donde se aplica una capa de acrílico sobre la uña natural (sin alargarla) para fortalecerla y protegerla, mejorando su durabilidad. Incluye esmaltado semipermanente.' },
        { Id: 8, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿Cuál es la diferencia entre uñas acrílicas esculpidas y Kapping/Baño acrílico?', VcAnswer: 'Las uñas acrílicas esculpidas alargan artificialmente las uñas usando moldes. El Kapping o baño de acrílico solo aplica una capa protectora sobre la longitud natural de la uña, sin extenderla.' },
        { Id: 9, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿Cada cuánto debo hacer mantenimiento a mis uñas acrílicas (relleno)?', VcAnswer: 'El mantenimiento (relleno) se recomienda cada 20 días o máximo un mes, dependiendo del crecimiento de tu uña natural, para cubrir la zona de crecimiento y mantener la estructura.' },
        { Id: 10, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿Qué son las uñas Press On / Gel X?', VcAnswer: 'Son extensiones prefabricadas (de gel suave en el caso de Gel X) que se adhieren a las uñas naturales usando un gel especial y curado con lámpara. Logran una extensión inmediata e incluyen esmaltado semipermanente.' },
        { Id: 11, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿Cuánto tiempo duran las uñas Press On / Gel X?', VcAnswer: 'Con el cuidado adecuado, pueden durar entre 2 y 3 semanas antes de necesitar mantenimiento o retiro/reemplazo.' },
        { Id: 12, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿Son seguras las uñas Press On / Gel X?', VcAnswer: 'Sí, son seguras cuando son aplicadas y retiradas por profesionales. Usamos productos de calidad y técnicas adecuadas para no dañar la uña natural.' },
        { Id: 13, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿En qué consiste el mantenimiento de acrílico (relleno)?', VcAnswer: 'Consiste en retirar el esmaltado anterior y el acrílico levantado o en mal estado, preparar la uña natural expuesta y aplicar acrílico nuevo en la zona de crecimiento para rellenar el espacio. Incluye nuevo esmaltado semipermanente.' },
        { Id: 14, CompanyId: 1, CategoryServiceId: 6, VcQuestion: '¿Qué cuidados debo tener después de realizarme un servicio de uñas?', VcAnswer: 'Recomendamos usar guantes para tareas de limpieza, aplicar aceite de cutículas diariamente, evitar usar las uñas como herramientas y mantener manos/pies hidratados. Te daremos indicaciones específicas según el servicio.' },
        { Id: 15, CompanyId: 1, CategoryServiceId: 3, VcQuestion: '¿Qué hago si se me rompe una uña (natural o artificial)?', VcAnswer: 'Evita manipularla en exceso o intentar pegarla con productos no profesionales. Contáctanos lo antes posible para programar una reparación y evitar daños mayores o posibles infecciones.' },
        { Id: 16, CompanyId: 1, CategoryServiceId: 4, VcQuestion: '¿Qué servicios de cejas ofrecen?', VcAnswer: 'Ofrecemos diseño y perfilado de cejas (incluye análisis de visagismo y depilación con cera), laminado de cejas y tinte de cejas.' },
        { Id: 17, CompanyId: 1, CategoryServiceId: 4, VcQuestion: '¿Qué tipos de servicios de pestañas tienen disponibles?', VcAnswer: 'Realizamos lifting de pestañas (rizado natural), tinte de pestañas, y extensiones de pestañas (técnicas como pelo a pelo o punto a punto según disponibilidad).' },
        { Id: 18, CompanyId: 1, CategoryServiceId: 4, VcQuestion: '¿Cuánto dura el efecto del Lifting de Pestañas?', VcAnswer: 'El efecto suele durar entre 6 y 8 semanas, dependiendo del ciclo de crecimiento natural de tus pestañas.' },
        { Id: 19, CompanyId: 1, CategoryServiceId: 6, VcQuestion: '¿Cuál es la política de cancelación o reprogramación de citas?', VcAnswer: 'Puedes cancelar o reprogramar tu cita sin cargo avisando con al menos 24 horas de anticipación. Cancelaciones tardías o no presentarse puede generar un cargo o requerir un depósito para futuras reservas.' },
        { Id: 20, CompanyId: 1, CategoryServiceId: 6, VcQuestion: '¿Qué sucede si llego tarde a mi cita?', VcAnswer: 'Te pedimos puntualidad. Si llegas tarde, es posible que tengamos que acortar tu servicio para no afectar a otros clientes o, si el retraso es considerable, reprogramar tu cita (podría aplicarse la política de cancelación tardía). Comunícate si prevés un retraso.' },
        { Id: 21, CompanyId: 1, CategoryServiceId: 6, VcQuestion: '¿Cuáles son las formas de pago aceptadas?', VcAnswer: 'Aceptamos pagos en efectivo, tarjetas de crédito/débito, transferencias bancarias y pagos móviles como Nequi y Daviplata (confirma disponibilidad al momento del pago).' },
        { Id: 22, CompanyId: 1, CategoryServiceId: 5, VcQuestion: '¿Ofrecen servicios a domicilio?', VcAnswer: 'Generalmente no, nuestros servicios se realizan en el salón. Para eventos especiales (bodas, etc.), consúltanos con anticipación para evaluar la posibilidad y condiciones.' },
        { Id: 23, CompanyId: 1, CategoryServiceId: 5, VcQuestion: '¿Puedo elegir con qué profesional quiero mi servicio?', VcAnswer: 'Sí, al reservar online puedes seleccionar un profesional específico si tienes preferencia y ver su disponibilidad horaria.' },
        { Id: 24, CompanyId: 1, CategoryServiceId: 5, VcQuestion: '¿Dónde están ubicados y cuál es su horario?', VcAnswer: 'Puedes encontrar nuestra dirección exacta y los horarios de atención actualizados en nuestra página web, perfil de reserva (WeiBook) o redes sociales.' },
        { Id: 25, CompanyId: 1, CategoryServiceId: 6, VcQuestion: '¿Tienen medidas especiales de higiene y esterilización?', VcAnswer: 'Absolutamente. La higiene es primordial. Esterilizamos herramientas metálicas en autoclave después de cada uso y utilizamos materiales desechables (limas, palitos) siempre que sea posible.' },
        { Id: 26, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿Necesito preparar mis uñas de alguna manera antes de la cita de manicura?', VcAnswer: 'No es estrictamente necesario. Solo asegúrate de no tener cremas o aceites muy recientes en las uñas/manos, especialmente para servicios de gel o acrílico, para asegurar una buena adherencia.' },
        { Id: 27, CompanyId: 1, CategoryServiceId: 2, VcQuestion: '¿Con qué frecuencia debo hacerme una pedicura?', VcAnswer: 'Generalmente se recomienda cada 4-6 semanas para mantener pies y uñas saludables y estéticos, pero puede variar según tus necesidades (ej. crecimiento rápido, uso de calzado abierto, etc.).' },
        { Id: 28, CompanyId: 1, CategoryServiceId: 6, VcQuestion: '¿Los precios mostrados en la web incluyen IVA/impuestos?', VcAnswer: 'Sí, por lo general, los precios mostrados en nuestra plataforma de reserva para clientes finales ya incluyen los impuestos aplicables. El detalle final se confirma al momento de pagar.' },
        { Id: 29, CompanyId: 1, CategoryServiceId: 3, VcQuestion: '¿Ofrecen decoración o Nail Art?', VcAnswer: 'Sí, ofrecemos servicios de decoración y Nail Art como un extra. Puedes seleccionarlo al reservar. El tiempo y coste adicional dependen de la complejidad del diseño deseado.' },
        { Id: 30, CompanyId: 1, CategoryServiceId: 3, VcQuestion: '¿Realizan el retiro de sistemas artificiales (acrílico, gel, Press On)?', VcAnswer: 'Sí, ofrecemos el servicio de retiro profesional y seguro de cualquier sistema artificial, te lo hayas hecho o no con nosotros. Es importante hacerlo correctamente para no dañar la uña natural.' },
        { Id: 31, CompanyId: 1, CategoryServiceId: 1, VcQuestion: '¿En qué consiste la Manicura Rusa Combinada?', VcAnswer: 'Es una técnica avanzada que utiliza fresas de torno para una limpieza extremadamente precisa y profunda de la zona de la cutícula, logrando un acabado muy pulido y permitiendo esmaltar más cerca de la piel para un efecto de crecimiento más lento.' }
    ];

    try {
        // Guardar los datos base de las FAQs
        await repository.save(faqsData);
        console.log(`Faqs seeded successfully (${faqsData.length} faqs).`);
    } catch (error) {
        console.error('Error seeding Faqs:', error);
        throw error; // Re-lanzar para que el runner principal lo capture
    }
};