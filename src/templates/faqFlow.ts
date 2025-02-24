import { addKeyword, EVENTS } from "@builderbot/bot";
import aiServices from "~/services/llm/aiServices";
import { config } from "~/config";
import path from "path";
import fs, { stat} from "fs";

const pathPrompt = path.join(
    process.cwd(),
    "assets/prompts",
    "prompt_llm.txt"
);

const prompt = fs.readFileSync(pathPrompt, "utf-8");

export const faqFlow = addKeyword(EVENTS.ACTION)
    .addAction(
        async (ctx, {state, endFlow, gotoFlow}) => {
            try{
                const AI = new aiServices(config.LLM_APIKEY);
                const response = await AI.chat(prompt, [{role: "user", content: ctx.body}]);
                return endFlow(response);
            }catch (error) {
                console.error("Error en la llamada con el LLM", error);
                return endFlow("Por favor, intenta de nuevo");
            }
        }
    );