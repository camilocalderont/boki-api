import { addKeyword, EVENTS } from "@builderbot/bot";
import { readFileSync } from 'fs';
import { join } from 'path';
import { categoryFlow } from "./category.flow";
import { appintmentFlow } from "./appointment.flow";
import { faqFlow } from "./faq.flow";

const menu = readFileSync(join(__dirname, 'menu.txt'), 'utf8');


export const menuFlow = addKeyword("Menu").addAnswer(
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
                return gotoFlow(categoryFlow);
            case "2":
                return gotoFlow(appintmentFlow);
            case "3":
                return gotoFlow(faqFlow);
            case "0":
                return await flowDynamic(
                    "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu*'"
                );
        }
    }
);
