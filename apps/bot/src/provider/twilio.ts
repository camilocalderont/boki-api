import { TwilioProvider as Provider } from '@builderbot/provider-twilio';
import { createProvider } from "@builderbot/bot";
import { config } from "~/bot/config";

console.log("ACC_SID", config.ACC_SID);
console.log("ACC_TOKEN", config.ACC_TOKEN);
console.log("ACC_VENDOR", config.ACC_VENDOR);


export const provider = createProvider(Provider, {
    accountSid: config.ACC_SID,
    authToken: config.ACC_TOKEN,
    vendorNumber: config.ACC_VENDOR,
});