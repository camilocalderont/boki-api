import { DataSource } from 'typeorm';
import { FaqsEntity } from '../../../modules/faqs/entities/faqs.entity';

export const faqsSeed = async (dataSource: DataSource): Promise<void> => {
  const repository = dataSource.getRepository(FaqsEntity);

  // Verificar si ya existen datos
  const existingCount = await repository.count();
  if (existingCount > 0) {
    console.log(`Faqs already seeded (${existingCount} found). Skipping.`);
    return;
  }

  // Datos completos de las FAQs organizadas por categoría
  const faqsData = [
    // ========================
    // CATEGORÍA 1: Derechos de niños, niñas y adolescentes (CategoryServiceId: 1)
    // ========================
    {
      CompanyId: 1,
      CategoryServiceId: 1,
      VcQuestion: '¿Qué hacer si conozco un caso de maltrato infantil?',
      VcAnswer:
        'Debe reportarlo inmediatamente al personero, la Comisaría de Familia, ICBF o línea 141. Según la Ley 1098 de 2006 (Código de Infancia y Adolescencia), todas las personas tienen el deber de denunciar la amenaza o vulneración de los derechos de los niños. El personero coordinará con las autoridades competentes para activar medidas de protección inmediatas.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 1,
      VcQuestion: '¿Mi hijo tiene derecho a un cupo escolar?',
      VcAnswer:
        'Sí, según el artículo 67 de la Constitución y la Ley 1098 de 2006, la educación es un derecho fundamental de los niños. Si le niegan el cupo, puede acudir al personero quien intervendrá ante la Secretaría de Educación. Si es urgente, se puede interponer una acción de tutela para garantizar este derecho.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 1,
      VcQuestion: '¿Qué pasa si un menor está en situación de calle?',
      VcAnswer:
        'El personero debe coordinar inmediatamente con el ICBF y la Policía de Infancia y Adolescencia. Según la Ley 1098, artículo 44, estos niños requieren protección especial y medidas de restablecimiento de derechos que incluyen albergue temporal, atención médica y psicológica.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 1,
      VcQuestion: '¿Pueden obligar a trabajar a un menor de edad?',
      VcAnswer:
        'No. La Ley 1098 de 2006 prohíbe el trabajo infantil y establece que los adolescentes solo pueden trabajar con autorización del Ministerio de Trabajo y cumpliendo estrictas condiciones. Si conoce un caso, repórtelo al personero quien coordinará con la Inspección de Trabajo para hacer cesar esta situación.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 1,
      VcQuestion: '¿Qué hacer si un niño no recibe alimentos de su padre?',
      VcAnswer:
        'Puede acudir a la Comisaría de Familia o al personero. Según el Código de Infancia y Adolescencia, los padres tienen la obligación de suministrar alimentos. La Comisaría puede fijar una cuota alimentaria provisional y el personero puede apoyar en el proceso si hay irregularidades.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 1,
      VcQuestion: '¿Un menor puede denunciar por sí mismo?',
      VcAnswer:
        'Sí. La Ley 1098 de 2006 reconoce que los niños, niñas y adolescentes pueden ejercer directamente sus derechos y presentar quejas. El personero está obligado a escucharlos y tomar las medidas necesarias para proteger sus derechos, sin necesidad de representante legal.'
    },
    // Nuevas (Cat. 1)
    {
      CompanyId: 1,
      CategoryServiceId: 1,
      VcQuestion: '¿Dónde reporto ciberacoso o grooming a un menor?',
      VcAnswer:
        'Puede denunciar ante la Comisaría de Familia, Policía (CAI virtual) y Fiscalía. El colegio debe activar el Comité Escolar de Convivencia si ocurre en el entorno escolar. (Fundamento: Ley 1620 de 2013 y Ley 1098 de 2006).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 1,
      VcQuestion: '¿Qué hacer si un menor requiere atención médica urgente y se la niegan?',
      VcAnswer:
        'La salud de los menores es prioritaria. Puede interponer tutela y pedir acompañamiento del personero. (Fundamento: Constitución art. 44; Ley Estatutaria 1751 de 2015; Ley 1098 de 2006).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 1,
      VcQuestion: '¿Cómo se tramita la salida del país de un menor sin autorización del otro padre?',
      VcAnswer:
        'Debe acudirse a Comisaría de Familia o juez de familia para autorización sustitutiva. El personero puede orientar sobre el trámite. (Fundamento: Código de Infancia y Adolescencia y normas de familia aplicables).'
    },

    // ========================
    // CATEGORÍA 2: Violencia intrafamiliar o de género (CategoryServiceId: 2)
    // ========================
    {
      CompanyId: 1,
      CategoryServiceId: 2,
      VcQuestion: '¿Qué hacer si soy víctima de violencia intrafamiliar?',
      VcAnswer:
        'Acuda inmediatamente a la Comisaría de Familia, Personería o llame a la línea 155. Según las Leyes 294 de 1996 y 1257 de 2008, tiene derecho a medidas de protección inmediatas como órdenes de alejamiento. El personero verificará que las autoridades ejecuten estas medidas de protección.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 2,
      VcQuestion: '¿La violencia psicológica también es un delito?',
      VcAnswer:
        'Sí. La Ley 1257 de 2008 reconoce la violencia psicológica como una forma de violencia contra la mujer. Incluye humillaciones, amenazas, control excesivo y aislamiento. Puede denunciar ante la Comisaría de Familia, Fiscalía o el personero quien la orientará sobre los pasos a seguir.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 2,
      VcQuestion: '¿Qué medidas de protección puedo solicitar?',
      VcAnswer:
        'Según la Ley 1257 de 2008, puede solicitar: orden de alejamiento del agresor, desalojo del hogar, prohibición de comunicación, protección policial, y acceso a programas de atención. La Comisaría de Familia o el juez pueden otorgar estas medidas, y el personero supervisa su cumplimiento.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 2,
      VcQuestion: '¿Puedo denunciar violencia aunque sea mi esposo?',
      VcAnswer:
        'Absolutamente sí. La Ley 294 de 1996 establece que ningún vínculo familiar justifica la violencia. El matrimonio no elimina el derecho a la integridad personal. Puede denunciar ante la Comisaría de Familia, Fiscalía o personero sin temor a consecuencias legales por "traicionar" el matrimonio.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 2,
      VcQuestion: '¿Qué pasa si el agresor no cumple las medidas de protección?',
      VcAnswer:
        'El incumplimiento puede configurar el delito de fraude a resolución judicial o administrativa de policía (Código Penal art. 454). Debe reportar de inmediato; la autoridad puede disponer medidas policivas y la Fiscalía investigar. El personero puede acompañar y vigilar el cumplimiento.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 2,
      VcQuestion: '¿Hay atención gratuita para víctimas de violencia?',
      VcAnswer:
        'Sí. Según la Ley 1257 de 2008, el Estado debe garantizar atención integral gratuita: médica, psicológica, legal y social. Puede acceder a estos servicios en hospitales públicos, Comisaría de Familia y programas municipales. El personero puede orientarla sobre dónde acceder a estos servicios.'
    },
    // Nuevas (Cat. 2)
    {
      CompanyId: 1,
      CategoryServiceId: 2,
      VcQuestion: '¿Qué es violencia económica o patrimonial y cómo se prueba?',
      VcAnswer:
        'Es el control de recursos, privación de bienes o dinero, y daños a objetos para someter a la víctima. Guarde extractos, chats y recibos. (Fundamento: Ley 1257 de 2008).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 2,
      VcQuestion: 'Sufrí agresión un fin de semana, ¿a dónde acudo?',
      VcAnswer:
        'Llame 123/155, acuda a Policía y Medicina Legal, y a la URI de la Fiscalía. La Comisaría de Familia tramita en el primer día hábil; pida medidas provisionales. (Fundamento: Ley 1257 de 2008).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 2,
      VcQuestion: '¿Qué hago para conservar evidencia de violencia?',
      VcAnswer:
        'Busque atención médica, tome fotos de lesiones, guarde mensajes y denuncie. Solicite valoración de Medicina Legal. (Fundamento: protocolo de atención integral, Ley 1257 de 2008).'
    },

    // ========================
    // CATEGORÍA 3: Problemas de convivencia ciudadana (CategoryServiceId: 3)
    // ========================
    {
      CompanyId: 1,
      CategoryServiceId: 3,
      VcQuestion: '¿Qué hacer si mi vecino hace ruido excesivo?',
      VcAnswer:
        'Puede presentar una queja ante la Inspección de Policía o el personero. Según el Código Nacional de Policía (Ley 1801 de 2016), el ruido excesivo es una contravención que puede ser sancionada con multas. Primero intente el diálogo, si no funciona, formalice la queja.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 3,
      VcQuestion: '¿Puedo denunciar a alguien por arrojar basura en la calle?',
      VcAnswer:
        'Sí. El Código Nacional de Policía sanciona arrojar residuos en el espacio público con multas económicas. Puede reportar esta conducta al personero o la Inspección de Policía, aportando evidencias como fotos o testimonios. También puede acudir a la Policía Nacional para que levante la contravención.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 3,
      VcQuestion: '¿Qué hacer si hay riñas constantes en mi barrio?',
      VcAnswer:
        'Reporte inmediatamente a la Policía Nacional (123) y presente una queja formal ante el personero. Según la Ley 1801 de 2016, las riñas en espacio público son contravenciones. El personero puede solicitar mayor presencia policial y medidas preventivas para garantizar la seguridad del sector.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 3,
      VcQuestion: '¿Pueden multar por no recoger los excrementos de mi mascota?',
      VcAnswer:
        'Sí. El Código Nacional de Policía establece que es responsabilidad del propietario recoger los excrementos de su mascota en el espacio público. El no hacerlo puede generar multas. Si recibe una multa que considera injusta, puede presentar recurso ante el personero o la autoridad que la impuso.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 3,
      VcQuestion: '¿Qué hacer con vecinos que no cuidan sus mascotas?',
      VcAnswer:
        'Puede presentar queja ante la Inspección de Policía o el personero. Si las mascotas representan peligro o molestia, según la Ley 1774 de 2016 y el Código de Policía, los propietarios deben garantizar el bienestar animal y evitar molestias a terceros. Se pueden imponer medidas correctivas.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 3,
      VcQuestion: '¿Puedo reclamar por mal estado de parques o vías?',
      VcAnswer:
        'Sí. Puede presentar derecho de petición ante la alcaldía o queja ante el personero. Según el artículo 79 de la Constitución, todos tienen derecho a gozar de un ambiente sano. El personero puede presionar a la administración municipal para que ejecute las reparaciones necesarias en el espacio público.'
    },
    // Nuevas (Cat. 3)
    {
      CompanyId: 1,
      CategoryServiceId: 3,
      VcQuestion: '¿Qué hacer si hay ocupación indebida del espacio público (ventas, parqueo)?',
      VcAnswer:
        'Puede reportarlo a la Inspección de Policía para medidas correctivas y conciliación. (Fundamento: Ley 1801 de 2016, normas de uso del espacio público).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 3,
      VcQuestion: 'Tenemos conflicto por linderos, ¿puede ayudar la Personería?',
      VcAnswer:
        'La Personería puede orientar y promover conciliación. Según el caso, el Inspector de Policía o juez civil define linderos. (Fundamento: competencias de policía y civiles; Ley 640 de 2001 para conciliación).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 3,
      VcQuestion: '¿Está permitido el consumo de sustancias en el espacio público?',
      VcAnswer:
        'El Código de Policía regula el consumo y faculta medidas para proteger a niños y convivencia. Consulte normas locales. (Fundamento: Ley 1801 de 2016).'
    },

    // ========================
    // CATEGORÍA 4: Derechos al trabajo (quejas laborales) (CategoryServiceId: 4)
    // ========================
    {
      CompanyId: 1,
      CategoryServiceId: 4,
      VcQuestion: '¿Qué hacer si no me pagan el salario completo?',
      VcAnswer:
        'Presente una queja ante la Inspección de Trabajo del Ministerio de Trabajo o ante el personero. Según el Código Sustantivo del Trabajo, el salario es inembargable e irrenunciable. Reúna evidencias como recibos de pago, contratos y testimonios. El personero puede orientarlo sobre los pasos a seguir.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 4,
      VcQuestion: '¿Pueden despedirme sin justa causa?',
      VcAnswer:
        'Pueden despedirlo, pero deben pagar indemnización según el artículo 64 del Código Sustantivo del Trabajo. Si considera que el despido fue discriminatorio o por ejercer sus derechos, puede reclamar ante la Inspección de Trabajo. El personero puede orientarlo sobre sus derechos laborales.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 4,
      VcQuestion: '¿Qué hacer si me obligan a trabajar horas extras no pagadas?',
      VcAnswer:
        'Eso es ilegal. Según el Código Sustantivo del Trabajo, las horas extras deben pagarse con recargo. Presente queja ante la Inspección de Trabajo con evidencias (horarios, testigos, mensajes). El personero puede apoyarlo orientándolo sobre el proceso de denuncia formal.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 4,
      VcQuestion: '¿Tengo derecho a vacaciones remuneradas?',
      VcAnswer:
        'Sí. Según el artículo 186 del Código Sustantivo del Trabajo, por cada año de servicio tiene derecho a 15 días hábiles de vacaciones remuneradas. Si se las niegan, puede reclamar ante la Inspección de Trabajo o solicitar orientación al personero sobre sus derechos.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 4,
      VcQuestion: '¿Qué hacer si me discriminan en el trabajo por mi condición?',
      VcAnswer:
        'La discriminación laboral está prohibida por la Constitución (art. 13) y la Ley 1482 de 2011. Puede denunciar ante la Inspección de Trabajo, Ministerio Público o presentar acción de tutela. El personero puede orientarlo sobre las rutas de denuncia y acompañarlo en el proceso.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 4,
      VcQuestion: '¿Me pueden descontar del salario sin mi autorización?',
      VcAnswer:
        'No, excepto por obligaciones legales (seguridad social, retención en la fuente) o autorizaciones expresas por escrito según el Código Sustantivo del Trabajo. Descuentos arbitrarios son ilegales. Presente queja ante la Inspección de Trabajo o solicite orientación al personero.'
    },
    // Nuevas (Cat. 4)
    {
      CompanyId: 1,
      CategoryServiceId: 4,
      VcQuestion: '¿Qué hago si mi liquidación final está incompleta?',
      VcAnswer:
        'Reclame por escrito a su empleador y, si no corrige, denuncie ante el Ministerio de Trabajo. La liquidación incluye salarios, prestaciones, cesantías e intereses. (Fundamento: CST y normas de liquidación).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 4,
      VcQuestion: '¿Cómo actuar ante acoso sexual laboral?',
      VcAnswer:
        'Denuncie ante el Comité de Convivencia, Ministerio de Trabajo y, si aplica, Fiscalía. (Fundamento: Ley 1010 de 2006; Código Penal en conductas de acoso sexual).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 4,
      VcQuestion: '¿Qué es el fuero sindical y qué implica para despidos?',
      VcAnswer:
        'Protege a ciertos representantes y afiliados; para despedir se requiere autorización judicial. (Fundamento: CST y Ley 584 de 2000).'
    },

    // ========================
    // CATEGORÍA 5: Servicios públicos (agua, luz, salud, etc.) (CategoryServiceId: 5)
    // ========================
    {
      CompanyId: 1,
      CategoryServiceId: 5,
      VcQuestion: '¿Qué hacer si me cortan el agua sin previo aviso?',
      VcAnswer:
        'Debe mediar aviso previo conforme la Ley 142 de 1994 y regulación vigente. Si lo cortaron sin aviso o estando al día, presente reclamo ante la empresa y queja ante el personero o la Superintendencia de Servicios Públicos.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 5,
      VcQuestion: '¿Pueden cortarme los servicios si tengo niños pequeños?',
      VcAnswer:
        'La Corte Constitucional ha protegido el acceso mínimo vital en casos con menores, adultos mayores o personas con discapacidad. Puede interponer tutela y acudir al personero. (Fundamento: jurisprudencia constitucional; derecho al mínimo vital).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 5,
      VcQuestion: '¿Cómo reclamar por cobros excesivos en los servicios?',
      VcAnswer:
        'Presente reclamo por escrito ante la empresa prestadora del servicio según la Ley 142 de 1994. Si no responden oportunamente o la respuesta no es satisfactoria, puede elevar queja ante la Superintendencia de Servicios Públicos o solicitar apoyo del personero.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 5,
      VcQuestion: '¿Qué hacer si no tengo acceso a salud por falta de pagos en EPS?',
      VcAnswer:
        'La salud es un derecho fundamental (Ley Estatutaria 1751 de 2015). No pueden negarle servicios de urgencias. Presente tutela o acuda al personero inmediatamente. También puede presentar queja ante la Superintendencia de Salud.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 5,
      VcQuestion: '¿Puedo exigir mejores vías de acceso a mi barrio?',
      VcAnswer:
        'Sí, puede presentar derecho de petición ante la alcaldía solicitando mejoramiento vial. Si no hay respuesta satisfactoria, acuda al personero. (Fundamento: Constitución art. 79 – ambiente sano, competencias municipales).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 5,
      VcQuestion: '¿Qué hacer si mi barrio no tiene recolección de basuras?',
      VcAnswer:
        'Presente derecho de petición ante la alcaldía y la empresa de aseo. Si no hay respuesta o solución, acuda al personero o la Superservicios. La recolección es un servicio público domiciliario regulado por la Ley 142 de 1994.'
    },
    // Nuevas (Cat. 5)
    {
      CompanyId: 1,
      CategoryServiceId: 5,
      VcQuestion: 'La lectura de mi medidor es errónea, ¿qué hago?',
      VcAnswer:
        'Solicite verificación técnica y recalculo. Si no responden, acuda a la Superservicios. (Fundamento: Ley 142 de 1994 – régimen de usuarios).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 5,
      VcQuestion: 'No estoy de acuerdo con el estrato asignado, ¿puedo reclamar?',
      VcAnswer:
        'Sí, presente reclamación ante la autoridad municipal competente y solicite revisión. (Fundamento: régimen de estratificación y servicios públicos).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 5,
      VcQuestion: '¿Qué recursos puedo interponer ante la empresa de servicios?',
      VcAnswer:
        'Puede presentar reposición y en subsidio apelación, según manual del usuario. (Fundamento: Ley 142 de 1994).'
    },

    // ========================
    // CATEGORÍA 6: Presentar queja, petición o tutela (CategoryServiceId: 6)
    // ========================
    {
      CompanyId: 1,
      CategoryServiceId: 6,
      VcQuestion: '¿Cómo presento un derecho de petición?',
      VcAnswer:
        'Según la Ley 1755 de 2015, presente un documento dirigido a la entidad competente, con su nombre, identificación, dirección y solicitud clara. Puede radicar presencialmente o por medios electrónicos. La entidad debe responder en los términos legales.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 6,
      VcQuestion: '¿Cuándo puedo presentar una tutela?',
      VcAnswer:
        'Cuando una autoridad pública o particular vulnere o amenace sus derechos fundamentales y no existan otros mecanismos eficaces, o haya urgencia. (Fundamento: Constitución art. 86 y Decreto 2591 de 1991).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 6,
      VcQuestion: '¿Qué requisitos debe tener una tutela?',
      VcAnswer:
        'Debe contener identificación del solicitante, hechos, derechos vulnerados, autoridad o particular responsable y la solicitud concreta. Puede presentarse ante cualquier juez sin abogado. (Decreto 2591 de 1991).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 6,
      VcQuestion: '¿Qué pasa si no me responden un derecho de petición?',
      VcAnswer:
        'Si la entidad no responde en los términos de la Ley 1755 de 2015, puede presentar queja ante el Ministerio Público, pedir apoyo del personero, o presentar tutela por vulneración al derecho de petición cuando corresponda.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 6,
      VcQuestion: '¿Puedo presentar una queja anónima?',
      VcAnswer:
        'Sí, puede presentar quejas anónimas ante el personero, pero es recomendable identificarse para recibir respuesta. Las quejas anónimas se tramitan cuando involucran interés general o violación masiva de derechos. (Fundamento: funciones del Ministerio Público – Ley 136 de 1994).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 6,
      VcQuestion: '¿El personero puede representarme en procesos judiciales?',
      VcAnswer:
        'No directamente en procesos civiles o penales privados, pero sí puede acompañarlo, orientarlo y presentar acciones públicas cuando se vulneren derechos colectivos o fundamentales. (Fundamento: Ley 136 de 1994).'
    },
    // Nuevas (Cat. 6)
    {
      CompanyId: 1,
      CategoryServiceId: 6,
      VcQuestion: '¿Cuáles son los términos para responder peticiones?',
      VcAnswer:
        'Ley 1755 de 2015: 15 días hábiles (peticiones generales), 10 días hábiles (información y copias) y 30 días hábiles (consultas).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 6,
      VcQuestion: '¿Qué es la acción de cumplimiento?',
      VcAnswer:
        'Sirve para exigir a la autoridad el cumplimiento de una ley o acto administrativo incumplido. (Fundamento: Ley 393 de 1997).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 6,
      VcQuestion: '¿Cómo y dónde presento una queja disciplinaria contra un funcionario?',
      VcAnswer:
        'Radíquela ante la Personería o Procuraduría con hechos y pruebas. (Fundamento: Código General Disciplinario – Ley 1952 de 2019).'
    },

    // ========================
    // CATEGORÍA 7: Información general de la Personería (CategoryServiceId: 7)
    // ========================
    {
      CompanyId: 1,
      CategoryServiceId: 7,
      VcQuestion: '¿Cuál es el horario de atención de la Personería?',
      VcAnswer:
        'La Personería atiende de lunes a viernes de 8:00 AM a 12:00 M y de 2:00 PM a 6:00 PM. Para emergencias de derechos fundamentales, use el número de emergencia o el correo institucional publicado por la entidad.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 7,
      VcQuestion: '¿Qué servicios presta gratuitamente la Personería?',
      VcAnswer:
        'Según la Ley 136 de 1994, los servicios de la Personería son gratuitos: orientación jurídica, mediación, seguimiento a quejas, acompañamiento en acciones constitucionales y promoción de derechos humanos.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 7,
      VcQuestion: '¿Qué funciones principales tiene el personero municipal?',
      VcAnswer:
        'Velar por los derechos humanos, recibir quejas por abuso de autoridad, ejercer control preventivo, promover DD.HH., intervenir cuando se afecten derechos fundamentales y actuar como Ministerio Público en el ámbito local. (Fundamento: Ley 136 de 1994 y Ley 1551 de 2012).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 7,
      VcQuestion: '¿Cómo puedo contactar al personero en caso de emergencia?',
      VcAnswer:
        'Use el número de emergencia institucional, correo oficial o acuda a las oficinas. En casos urgentes, también puede solicitar acompañamiento de la Policía Nacional y aviso inmediato al personero.'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 7,
      VcQuestion: '¿El personero puede sancionar a funcionarios públicos?',
      VcAnswer:
        'El personero puede iniciar actuaciones disciplinarias en el nivel municipal y remitir a Procuraduría cuando corresponda, pero no “sanciona” por vía penal o fiscal. (Fundamento: funciones del Ministerio Público; Ley 1952 de 2019, Ley 136 de 1994).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 7,
      VcQuestion: '¿Puedo solicitar acompañamiento del personero a diligencias?',
      VcAnswer:
        'Sí, cuando se requiera proteger derechos fundamentales o el interés público. El personero puede asistir a diligencias administrativas o judiciales. (Fundamento: Ley 136 de 1994).'
    },
    // Nuevas (Cat. 7)
    {
      CompanyId: 1,
      CategoryServiceId: 7,
      VcQuestion: '¿Qué es el Ministerio Público y cómo se relaciona con la Personería?',
      VcAnswer:
        'El Ministerio Público lo integran la Procuraduría, Defensoría del Pueblo y personerías. La Personería ejerce el Ministerio Público a nivel municipal. (Fundamento: Constitución y Ley 136 de 1994).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 7,
      VcQuestion: '¿Puedo presentar PQRS contra la misma Personería?',
      VcAnswer:
        'Sí. Puede radicar PQRS ante la Personería y, si no hay respuesta, acudir a Procuraduría o presentar tutela por derecho de petición. (Fundamento: Ley 1755 de 2015).'
    },
    {
      CompanyId: 1,
      CategoryServiceId: 7,
      VcQuestion: '¿La Personería atiende fines de semana?',
      VcAnswer:
        'La atención ordinaria es en horario hábil; para urgencias por derechos fundamentales se coordinan canales de atención prioritaria y articulación con Policía y Fiscalía. Verifique los teléfonos de emergencia publicados por la entidad.'
    }
  ];

  try {
    await repository.insert(faqsData);
    console.log(`Faqs seeded successfully (${faqsData.length} faqs across 7 categories).`);
  } catch (error) {
    console.error('Error seeding Faqs:', error);
    throw error;
  }
};
