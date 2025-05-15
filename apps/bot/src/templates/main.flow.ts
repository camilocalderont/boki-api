import { addKeyword, EVENTS } from "@builderbot/bot";
import { ApiService } from '../services/api/api.service';
import { ClientResponseDto } from '../services/api/dto/client.dto';
import { ApiResponse } from '../services/api/interfaces/api-response.interface';
import { registerFlow } from "./register.flow";

const apiService = new ApiService();


const mainFlow = addKeyword(EVENTS.WELCOME)
    .addAction(
        async (ctx, { flowDynamic, gotoFlow }) => {
            console.log(JSON.stringify(ctx));
            const numero = ctx.from;

            try {
                const response = await apiService.request<ApiResponse<ClientResponseDto>>(
                    '/clients/cellphone/:numero',
                    'GET',
                    null,
                    { numero }
                );

                if(response.status === 'success'){
                    const clientData = response?.data;
                        console.log('Cliente encontrado:', JSON.stringify(clientData));
                        await flowDynamic(`Hola ${clientData.VcFirstName}, bienvenido de nuevo!`);
                }else{
                    return gotoFlow(registerFlow);
                }
            } catch (error: any) {
                console.error('Cliente no encontrado: ', error.message);
                return gotoFlow(registerFlow);
            }
        }
    );

    const mainFlow2 = addKeyword('pepe')
    .addAnswer('Hi!, Do you know 4+4?', {capture:true}, async (_, {flowDynamic, fallBack}) => {
        const sum = 4 + 4
        const value = _.body;
        if (Number(value) !== sum) {
            return fallBack(`No, ${value} no es correcto, intenta de nuevo`);
        }
        await flowDynamic(`Total: ${sum} pero tu dijiste ${value}`)
    })
    .addAnswer('¿Quieres saber algo más?', {capture:true}, async (_, {flowDynamic, fallBack}) => {
        const value = _.body;
        if (value !== 'si' && value !== 'no') {
            return fallBack(`No entiendo, por favor responde con "si" o "no"`);
        }
        await flowDynamic(`Tu respuesta fue ${value}`)
    })
    .addAction(async (_, {flowDynamic}) => {
        await flowDynamic(`Other message`)
    })

export { mainFlow, mainFlow2 };