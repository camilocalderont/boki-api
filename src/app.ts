import 'reflect-metadata';
import bootstrapApi from './api/main';

async function main() {
  try {
    // Iniciar el API
    await bootstrapApi();
  } catch (error) {
    const errorCode = 1001;
    const customErrorMessage = 'A critical error occurred while starting the application';
    console.error(`[${customErrorMessage}] (Code: ${errorCode}) =>`, error.message);
    console.error(error.stack);
    process.exit(errorCode);
  }
}

main();
