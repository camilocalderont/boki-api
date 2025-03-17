import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Database Configuration
    POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST,
    POSTGRES_DB_PORT: process.env.POSTGRES_DB_PORT,
    POSTGRES_DB_USER: process.env.POSTGRES_DB_USER,
    POSTGRES_DB_PASSWORD: process.env.POSTGRES_DB_PASSWORD,
    POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,

    // Application Configuration
    PORT: process.env.PORT,
    API_PORT: process.env.PORT_API,
    JWT_SECRET: process.env.JWT_TOKEN,
    VERSION: process.env.VERSION,

    // Meta Provider Configuration
    NUMBER_ID: process.env.NUMBER_ID,
    VERIFY_TOKEN: process.env.VERIFY_TOKEN
};
