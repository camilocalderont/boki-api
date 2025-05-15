
import { addKeyword, EVENTS } from "@builderbot/bot";

export const categoryFlow = addKeyword(EVENTS.ACTION)
    .addAnswer('Estos son los servicios que ofrecemos', {
    });