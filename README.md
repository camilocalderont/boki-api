<p align="center">
  <a href="https://builderbot.vercel.app/">
    <picture>
      <img src="https://builderbot.vercel.app/assets/thumbnail-vector.png" height="80">
    </picture>
    <h2 align="center">BuilderBot</h2>
  </a>
</p>



<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@builderbot/bot">
    <img alt="" src="https://img.shields.io/npm/v/@builderbot/bot?color=%2300c200&label=%40bot-whatsapp">
  </a>
  <a aria-label="Join the community on GitHub" href="https://link.codigoencasa.com/DISCORD">
    <img alt="" src="https://img.shields.io/discord/915193197645402142?logo=discord">
  </a>
</p>


## Configuración Inicial

1. Asegúrate de tener PostgreSQL instalado y corriendo en tu máquina.

2. Crea un archivo `.env` basado en el `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Configura las variables de entorno en el archivo `.env`:
   ```env
   POSTGRES_DB_HOST=localhost
   POSTGRES_DB_USER=tu_usuario
   POSTGRES_DB_NAME=tu_base_de_datos
   POSTGRES_DB_PASSWORD=tu_contraseña
   POSTGRES_DB_PORT=5432
   ```

4. Ejecuta el script de configuración que instalará las dependencias, ejecutará las migraciones y compilará el proyecto:
   ```bash
   npm run setup
   ```

5. Inicia el proyecto:
   ```bash
   npm run dev
   ```

## Scripts Disponibles

- `npm run dev`: Inicia el proyecto en modo desarrollo
- `npm run build`: Compila el proyecto
- `npm run start`: Inicia el proyecto en modo producción
- `npm run migration:generate`: Genera una nueva migración
- `npm run migration:run`: Ejecuta las migraciones pendientes
- `npm run migration:revert`: Revierte la última migración

## Documentation

Visit [builderbot](https://builderbot.vercel.app/) to view the full documentation.


## Official Course

If you want to discover all the functions and features offered by the library you can take the course.
[View Course](https://app.codigoencasa.com/courses/builderbot?refCode=LEIFER)


## Contact Us
- [💻 Discord](https://link.codigoencasa.com/DISCORD)
- [👌 𝕏 (Twitter)](https://twitter.com/leifermendez)