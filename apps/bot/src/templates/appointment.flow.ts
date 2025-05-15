import { addKeyword, EVENTS } from "@builderbot/bot";

export const appintmentFlow = addKeyword(EVENTS.ACTION)
.addAnswer('Para reservar una cita, puedes hacerlo en nuestro sitio web: ww.bokibot.com')
