import { addKeyword, EVENTS } from "@builderbot/bot";
import aiServices from "~/bot/services/llm/aiServices";
import { config } from "~/bot/config";
import path from "path";
import fs, { stat} from "fs";

const pathPrompt = path.join(
    process.cwd(),
    "assets/prompts",
    "prompt_llm.txt"
);

const prompt = fs.readFileSync(pathPrompt, "utf-8");

export   const faqFlow = addKeyword(EVENTS.ACTION)
    .addAction({ capture: true }, async (ctx, { endFlow }) => {
        try{
            console.log(ctx.body, prompt);
            const ai = new aiServices(config.LLM_APIKEY);

            const response = await ai.chat(prompt, [{role: "user", content: ctx.body}]);
            return endFlow(response);
        }catch (error) {
            console.error("Error en la llamada con el LLM", error);
            return endFlow("Por favor, intenta de nuevo");
        }
    }
);
