import { addKeyword, EVENTS } from "@builderbot/bot";
import { readFileSync } from 'fs';
import { join } from 'path';

const mainFlow = addKeyword(EVENTS.WELCOME)
    .addAnswer(`🙌 Hey Hola bienvenido a *Bokibot*, soy tu asistente virtual. En que puedo ayudarte?  este es nuestro *Menu*`, {
        delay: 100,
        //media: "https://administradorpandora.bokibot.com/assets/pages/img/login/bg1.jpg"
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
    .addAnswer('Para hacer una consulta, puedes hacerlo en nuestro sitio web: ww.bokibot.com')
    .addAnswer("Hace tu consulta", { capture: true }, async (ctx, ctxFn) => {
        console.log(ctx.body);
        await ctxFn.flowDynamic("Te estamos respondiendo con AI");
        /*const prompt = promptConsultas
        const consulta = ctx.body
        const answer = await chat(prompt, consulta)
        await ctxFn.flowDynamic(answer.content)*/
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