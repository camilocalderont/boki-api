import "dotenv/config";


export const config = {
    PORT: process.env.PORT ?? 3008,
    //META PROVIDER
    jwtToken: process.env.META_BOT_TOKEN,
    numberId: process.env.META_NUMBER_ID,
    verifyToken: process.env.META_VERIFY_TOKEN,
    version: process.env.META_VERSION,

    //TWILIO PROVIDER
    ACC_SID: process.env.ACC_SID,
    ACC_TOKEN: process.env.ACC_TOKEN,
    ACC_VENDOR: process.env.ACC_VENDOR,


    //DATABASE
    POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST,
    POSTGRES_DB_USER: process.env.POSTGRES_DB_USER,
    POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
    POSTGRES_DB_PASSWORD: process.env.POSTGRES_DB_PASSWORD,
    POSTGRES_DB_PORT: process.env.POSTGRES_DB_PORT,

    //AI
    LLM_MODEL: process.env.LLM_MODEL,
    LLM_APIKEY: process.env.LLM_APIKEY,


};
