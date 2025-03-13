import "dotenv/config";

export const config = {
    PORT: process.env.PORT_API ?? 3000,
    //DATABASE
    POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST,
    POSTGRES_DB_USER: process.env.POSTGRES_DB_USER,
    POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
    POSTGRES_DB_PASSWORD: process.env.POSTGRES_DB_PASSWORD,
    POSTGRES_DB_PORT: process.env.POSTGRES_DB_PORT,
    //JWT
    JWT_SECRET: process.env.JWT_SECRET,
};