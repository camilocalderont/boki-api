import { MetaProvider as Provider } from "@builderbot/provider-meta";
import { createProvider } from "@builderbot/bot";
import { config } from "~/bot/config";

console.log("jwtToken", config.jwtToken);
console.log("numberId", config.numberId);
console.log("verifyToken", config.verifyToken);
console.log("version", config.version);

export const provider = createProvider(Provider, {
    jwtToken: config.jwtToken,
    numberId: config.numberId,
    verifyToken: config.verifyToken,
    version: config.version
});