import OpenAI from "openai";
import { config } from "~/bot/config";

class aiServices {
    private static apikey:string;
    private openAi: OpenAI;

    constructor(apikey: any) {
        aiServices.apikey = apikey;
        this.openAi = new OpenAI({
            apiKey: apikey,
        });
    }

    async chat(prompt: string, messages: any[]): Promise<string> {
        try {
        const completion = await this.openAi.chat.completions.create({
            model: config.LLM_MODEL,
            messages: [
                { role: "system", content: prompt },
                ...messages,
            ],
        });

        const answer = completion.choices[0].message?.content || "No response";
        return answer;
        }catch (error) {
            console.error("Error al conectar con el LLM",error);
            return "ERROR";
        }
    }

}

export default aiServices;