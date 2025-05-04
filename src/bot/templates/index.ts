import { createFlow } from "@builderbot/bot";
import { mainFlow, menuFlow, flowServicios, flowReservar, flowConsultas } from "./mainFlow";

export default createFlow([
    mainFlow,
    menuFlow,
    flowServicios,
    flowReservar,
    flowConsultas
]);