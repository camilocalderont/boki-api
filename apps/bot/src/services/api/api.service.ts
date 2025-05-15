import { config } from '../../config';

class ApiService {
    private readonly baseUrl: string;
    private readonly token: string;
    private readonly version: string;

    constructor() {
        if (!config.API_URL || !config.API_TOKEN || !config.API_VERSION) {
            throw new Error('API configuration (URL, Token, Version) is missing in environment variables.');
        }

        // Construir la URL base incluyendo el puerto si está definido
        let constructedBaseUrl = config.API_URL;
        if (config.API_PORT) {
            // Asegurarse de que la URL no termine ya con el puerto o una barra antes de añadirlo
            // Esto es una simplificación, podría necesitar lógica más robusta dependiendo de los formatos de API_URL
            const url = new URL(constructedBaseUrl);
            url.port = config.API_PORT;
            constructedBaseUrl = url.toString();
            // Si la URL base termina en '/', quitarla antes de añadir el path en request
            if (constructedBaseUrl.endsWith('/')) {
              constructedBaseUrl = constructedBaseUrl.slice(0, -1);
            }
        }

        this.baseUrl = constructedBaseUrl;
        this.token = config.API_TOKEN;
        this.version = config.API_VERSION;
    }

    /**
     * Realiza una petición a la API.
     * @param endpoint El endpoint específico de la API (ej: '/clients/cellphone/:numero').
     * @param method El método HTTP (GET, POST, PUT, DELETE, etc.).
     * @param body El cuerpo de la petición (opcional).
     * @param params Parámetros para reemplazar en el endpoint (ej: { numero: '123456789' }).
     * @returns La respuesta de la API en formato JSON.
     */
    async request<T>(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        body?: Record<string, any> | null,
        params?: Record<string, string | number>
    ): Promise<T> {
        let processedEndpoint = endpoint;
        if (params) {
            Object.keys(params).forEach(key => {
                processedEndpoint = processedEndpoint.replace(`:${key}`, String(params[key]));
            });
        }

        // Asegurarse de que el endpoint empiece con '/' para la concatenación
        const finalEndpoint = processedEndpoint.startsWith('/') ? processedEndpoint : `/${processedEndpoint}`;

        const url = `${this.baseUrl}/api/v${this.version}${finalEndpoint}`;
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'x-api-token': this.token,
        };

        const options: RequestInit = {
            method,
            headers,
        };

        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                // Intentar obtener más detalles del error si la API los proporciona
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    // Si el cuerpo no es JSON o está vacío
                    errorData = { status: response.status, statusText: response.statusText };
                }
                console.error('API Request Error:', JSON.stringify(errorData, null, 2));
                throw errorData;
            }

            // Si la respuesta no tiene contenido (ej. 204 No Content)
             if (response.status === 204) {
                return undefined as T; // O null, dependiendo de cómo quieras manejarlo
            }

            return await response.json() as T;
        } catch (error) {
            console.error(`Error during API request to ${url}:`, error);
            // Podrías querer lanzar un error más específico o manejarlo de otra forma
            throw error;
        }
    }
}

// Exportar una instancia única (Singleton) o la clase directamente
// Exportar la clase permite más flexibilidad si se necesita instanciar con diferentes configuraciones (aunque aquí depende de env vars)
// export default new ApiService();
export { ApiService };