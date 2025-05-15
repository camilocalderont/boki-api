import { addKeyword, EVENTS } from '@builderbot/bot';
import { ApiResponse } from '../services/api/interfaces/api-response.interface';
import { ClientRequestDto, ClientResponseDto } from '../services/api/dto/client.dto';
import { ApiService } from '../services/api/api.service';

const apiService = new ApiService();



const registerFlow = addKeyword(EVENTS.ACTION)
.addAnswer('👋 Hola, parece que eres nuevo por aquí.\n\n¿Quieres registrarte?\n\nResponde *SI* o *NO* (también puedes usar 1 o 0)',
    { capture: true }
)
.addAction(async (ctx, ctxFn) => {
    // Convertir respuesta a minúsculas para facilitar validación
    const response = ctx.body.toLowerCase();

    // Validar que la respuesta sea una de las opciones permitidas
    if (response === 'si' || response === '1') {
        await ctxFn.flowDynamic('✅ ¡Perfecto! Vamos a comenzar con tu registro 📝');
    } else if (response === 'no' || response === '0') {
        return ctxFn.endFlow('❌ El registro fue cancelado, puedes volver a escribirle al bot para registrarte cuando lo desees');
    } else {
        return ctxFn.fallBack('⚠️ Por favor, responde solo con *SI* o *NO* (o 1 o 0)');
    }
})
.addAnswer('📝 ¿Cuál es tu nombre completo?',
    { capture: true }
)
.addAction(async (ctx, ctxFn) => {
    await ctxFn.flowDynamic(`👤 Gracias ${ctx.body}!`);
    await ctxFn.state.update({ firstName: ctx.body });
})
.addAnswer('📧 ¿Cuál es tu correo electrónico?',
    { capture: true }
)
.addAction(async (ctx, ctxFn) => {
    // Validar formato de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(ctx.body)) {
        return ctxFn.fallBack('⚠️ Por favor, ingresa un correo electrónico válido');
    }

    await ctxFn.state.update({ email: ctx.body });
})
.addAnswer('🔢 ¿Cuál es tu número de identificación? solo escribe números',
    { capture: true }
)
.addAction(async (ctx, ctxFn) => {
    // Validar que sea un número de teléfono (simplificado)
    const identificacionRegex = /^\d{7,15}$/;
    const identificationNumber = ctx.body.replace(/\D/g, '');
    if (!identificacionRegex.test(identificationNumber)) {
        return ctxFn.fallBack('⚠️ Por favor, ingresa un número de teléfono válido (solo números)');
    }

    const state = ctxFn.state.getMyState();

    // Preparar objeto para enviar a la API
    const clientData: ClientRequestDto = {
        VcIdentificationNumber: identificationNumber,
        VcFirstName: state.firstName,
        VcEmail: state.email,
        VcPhone: ctx.body,
        VcFirstLastName: ' ',
    };

    try {
        // Llamar a la API para registrar el cliente
        const response = await apiService.request<ApiResponse<ClientResponseDto>>(
            '/clients',
            'POST',
            clientData
        );

        if(response.status === 'success'){
            await ctxFn.flowDynamic('🎉 ¡Excelente! Tus datos ya fueron registrados, ya puedes comenzar a utilizar nuestros servicios');
        }else{
            await ctxFn.flowDynamic('❌ Lo siento, hubo un error al registrar tus datos. Por favor, intenta nuevamente más tarde.');
        }
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        await ctxFn.flowDynamic('❌ Lo siento, hubo un error al registrar tus datos. Por favor, intenta nuevamente más tarde.');
    }
});


export { registerFlow };