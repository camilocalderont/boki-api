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
    version: config.version,
    debug: true
});

provider.on('error', (err) => {
    console.error('[meta-provider-error]', err?.response?.data ?? err);
});
provider.on('message', ({ body, from }) => {
    console.log(`Message Payload:`, { body, from })
})