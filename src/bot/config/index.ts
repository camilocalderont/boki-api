import "dotenv/config";

export const config = {
    PORT: process.env.PORT ?? 3008,
    //META PROVIDER
    jwtToken: process.env.JWT_TOKEN,
    numberId: process.env.NUMBER_ID,
    verifyToken: process.env.VERIFY_TOKEN,
    version: process.env.VERSION,
    //DATABASE
    POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST,
    POSTGRES_DB_USER: process.env.POSTGRES_DB_USER,
    POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
    POSTGRES_DB_PASSWORD: process.env.POSTGRES_DB_PASSWORD,
    POSTGRES_DB_PORT: process.env.POSTGRES_DB_PORT,

    //AI
    LLM_MODEL: process.env.MODEL,
    LLM_APIKEY: process.env.OPENAI_KEY,


};