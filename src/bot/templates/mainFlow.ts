import { addKeyword, EVENTS } from "@builderbot/bot";
import { readFileSync } from 'fs';
import { join } from 'path';
import aiServices from "../services/llm/aiServices";
import { config } from "../config";

const mainFlow = addKeyword(EVENTS.WELCOME)
    .addAnswer(`🙌 Hey Hola bienvenido a *Bokibot*, soy tu asistente virtual. En que puedo ayudarte?  este es nuestro *Menu*`, {
        delay: 100,
    },
    async (ctx, { gotoFlow }) => {
        console.log(JSON.stringify(ctx));
        return gotoFlow(menuFlow);
    }
);


const menu = readFileSync(join(__dirname, 'menu.txt'), 'utf8');

const flowServicios = addKeyword(EVENTS.ACTION)
    .addAnswer('Estos son los servicios que ofrecemos', {
        //media: "https://www.ujamaaresort.org/wp-content/uploads/2018/01/Ujamaa-restaurant-menu.pdf"
    });

    const flowReservar = addKeyword(EVENTS.ACTION)
    .addAnswer('Para reservar una cita, puedes hacerlo en nuestro sitio web: ww.bokibot.com')


const flowConsultas = addKeyword(EVENTS.ACTION)
    .addAnswer("Hace tu consulta", { capture: true }, async (ctx, { endFlow }) => {
        console.log(ctx.body);
        const ai = new aiServices(config.LLM_APIKEY);

        const prompt = "Eres un asistente de IA que responde preguntas de forma amigable y clara. Responde las preguntas de forma clara y concisa. Si la pregunta no es clara, pregunta para que puedas responderla de forma clara y concisa.";
        const consulta = [
            {
                role: "user",
                content: prompt
            }
        ];
        const response = await ai.chat(prompt, consulta)
        return endFlow(response);
    }
);


const menuFlow = addKeyword("Menu").addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!["1", "2", "3", "4", "0"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones."
            );
        }
        switch (ctx.body) {
            case "1":
                return gotoFlow(flowServicios);
            case "2":
                return gotoFlow(flowReservar);
            case "3":
                return gotoFlow(flowConsultas);
            case "0":
                return await flowDynamic(
                    "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu*'"
                );
        }
    }
);

export { mainFlow, menuFlow, flowServicios, flowReservar, flowConsultas };