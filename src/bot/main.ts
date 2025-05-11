import { createBot } from '@builderbot/bot';
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres';
//import { provider } from './provider';
import { config } from './config';
import templates from './templates';
import { provider } from './provider/meta';
//import { provider } from './provider/twilio';

const BOT_PORT = config.PORT || 3001;

async function bootstrapBot() {
    const adapterDB = new Database({
        host: config.POSTGRES_DB_HOST,
        user: config.POSTGRES_DB_USER,
        database: config.POSTGRES_DB_NAME,
        password: config.POSTGRES_DB_PASSWORD,
        port: +config.POSTGRES_DB_PORT,
    });

    const bot = await createBot({
        flow: templates,
        provider: provider,
        database: adapterDB,
    });

    bot.httpServer(+BOT_PORT);
    console.log(`Bot corriendo en el puerto ${BOT_PORT}`);


    bot.on('send_message', ({ answer, from }) => {
            console.log(`Send Message Payload:`, { answer, from })
    });
}

export default bootstrapBot;