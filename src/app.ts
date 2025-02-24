
import { createBot } from '@builderbot/bot'
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres'
import { provider } from './provider';
import { config } from './config';
import templates from './templates';

const PORT = config.PORT

const main = async () => {

    const adapterDB = new Database({
       host: config.POSTGRES_DB_HOST,
       user: config.POSTGRES_DB_USER,
       database: config.POSTGRES_DB_NAME,
       password: config.POSTGRES_DB_PASSWORD,
       port: +config.POSTGRES_DB_PORT
   });

    const { handleCtx, httpServer } = await createBot({
        flow: templates,
        provider: provider,
        database: adapterDB,
    });

    httpServer(+PORT);
}

main();
