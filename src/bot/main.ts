import { createBot } from '@builderbot/bot';
import { PostgreSQLAdapter as Database } from '@builderbot/database-postgres';
import { provider } from './provider';
import { config } from './config';
import templates from './templates';
//import { provider } from './provider/meta';
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

  const { handleCtx, httpServer } = await createBot({
    flow: templates,
    provider: provider,
    database: adapterDB,
  });

  httpServer(+BOT_PORT);
  console.log(`Bot corriendo en el puerto ${BOT_PORT}`);
}

export default bootstrapBot;