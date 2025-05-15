import { createFlow } from "@builderbot/bot";
import { mainFlow, mainFlow2} from "./main.flow";
import { appintmentFlow } from "./appointment.flow";
import { faqFlow } from "./faq.flow";
import { categoryFlow } from "./category.flow";
import { menuFlow } from "./menu.flow";
import { registerFlow } from "./register.flow";


export default createFlow([
    mainFlow2,
    mainFlow,
    menuFlow,
    categoryFlow,
    appintmentFlow,
    faqFlow,
    registerFlow
]);