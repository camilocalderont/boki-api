import { createFlow } from "@builderbot/bot";
import { mainFlow } from "./main.flow";
import { appintmentFlow } from "./appointment.flow";
import { faqFlow } from "./faq.flow";
import { categoryFlow } from "./category.flow";
import { menuFlow } from "./menu.flow";
import { registerFlow } from "./register.flow";
export default createFlow([
    mainFlow,
    menuFlow,
    categoryFlow,
    appintmentFlow,
    faqFlow,
    registerFlow
]);