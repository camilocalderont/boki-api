# Multi-stage build para optimizar el tamaño de la imagen
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar
RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    && apk add --no-cache git

# Copiar archivos de configuración de dependencias primero (mejor caché)
COPY package*.json ./
COPY tsconfig.json ./

# Instalar TODAS las dependencias (incluidas devDependencies para compilar)
RUN npm ci --prefer-offline --no-audit

# Copiar código fuente
COPY src/ ./src/

# Copiar assets si existe el directorio
COPY assets ./assets

# Compilar con TypeScript
RUN npx tsc --project tsconfig.json

# Instalar solo dependencias de producción
RUN npm ci --omit=dev --prefer-offline --no-audit

# Limpiar herramientas de compilación
RUN apk del .gyp

# ==========================================
# Etapa de producción
# ==========================================
FROM node:22-alpine AS production

WORKDIR /app

# Instalar dumb-init para mejor manejo de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

# Copiar archivos necesarios desde builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/assets ./assets

# Variables de entorno por defecto
ENV NODE_ENV=production \
    API_PORT=3000 \
    API_VERSION=1 \
    NODE_OPTIONS="--max-old-space-size=2048"

# Crear directorios necesarios con permisos correctos
RUN mkdir -p uploads logs && \
    chown -R nodejs:nodejs /app

# Exponer el puerto
EXPOSE 3000

# Cambiar al usuario no-root
USER nodejs

# Healthcheck (se puede sobrescribir en docker-compose)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Usar dumb-init para mejor manejo de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicio
CMD ["node", "dist/src/app.js"]