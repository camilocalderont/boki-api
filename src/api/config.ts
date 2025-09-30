import * as dotenv from 'dotenv';

dotenv.config();

export const configApi = {
    POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST,
    POSTGRES_DB_PORT: process.env.POSTGRES_DB_PORT,
    POSTGRES_DB_USER: process.env.POSTGRES_DB_USER,
    POSTGRES_DB_PASSWORD: process.env.POSTGRES_DB_PASSWORD,
    POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,

    PORT: process.env.PORT,
    API_PORT: process.env.API_PORT,
    JWT_SECRET: process.env.API_TOKEN,
    VERSION: process.env.API_VERSION,

    NUMBER_ID: process.env.NUMBER_ID,
    VERIFY_TOKEN: process.env.VERIFY_TOKEN,

    OPENAI_API_KEY: process.env.LLM_APIKEY
};
