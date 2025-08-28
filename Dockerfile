# Multi-stage build para optimizar el tamaño de la imagen
FROM node:21-alpine3.18 as builder

WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && apk add --no-cache git

# Copiar archivos de configuración de dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY rollup.config.js ./

# Instalar dependencias
RUN npm ci --only=production --ignore-scripts && \
    npm ci --ignore-scripts

# Copiar código fuente
COPY src/ ./src/
COPY assets/ ./assets/

# Compilar la aplicación
RUN npm run build && \
    apk del .gyp

# Etapa de producción
FROM node:21-alpine3.18 as production

WORKDIR /app

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 nodejs

# Copiar archivos necesarios desde builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/assets ./assets
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV API_PORT=3000
ENV API_VERSION=1

# Exponer el puerto
EXPOSE 3000

# Cambiar al usuario no-root
USER nodejs

# Comando de inicio
CMD ["npm", "start"]