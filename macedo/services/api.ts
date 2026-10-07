import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from '@/lib/session';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://backend-proyecto.n7softwares.com';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export type ApiError = Error & { status?: number; code?: string };

// Mensajes entendibles según el código de error del backend (sección 16 de la guía)
const FRIENDLY_ERRORS: Record<string, string> = {
  invalid_json: 'Los datos enviados no son válidos.',
  invalid_id: 'El identificador no es válido.',
  invalid_query: 'Los parámetros de búsqueda no son válidos.',
  unauthorized: 'Tenés que iniciar sesión para continuar.',
  invalid_token: 'Tu sesión venció. Iniciá sesión de nuevo.',
  not_found: 'El elemento no existe o no te pertenece.',
  database_error: 'Error del servidor. Probá de nuevo en unos minutos.',
  internal_error: 'Error del servidor. Probá de nuevo en unos minutos.',
  auth_unavailable:
    'No se pudo contactar al servicio de autenticación. Probá de nuevo.',
};

function buildError(status: number, body: any): ApiError {
  const code: string | undefined = body?.error?.code;
  const backendMessage: string | undefined =
    body?.error?.message ?? // errores propios del backend
    body?.msg ??            // errores de Supabase Auth
    body?.error_description;

  // validation_error: el backend explica qué campo falló, así que priorizamos su mensaje
  const message =
    (code !== 'validation_error' && code && FRIENDLY_ERRORS[code]) ||
    backendMessage ||
    `Error HTTP ${status}`;

  const error = new Error(message) as ApiError;
  error.status = status;
  error.code = code;
  return error;
}

// Pide un access_token nuevo usando el refresh_token. Devuelve true si salió bien.
async function refreshSession(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) return false;

    const data = await response.json();
    if (!data?.access_token || !data?.refresh_token) return false;

    await saveSession(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
  alreadyRetried = false
): Promise<T> {
  const { auth, ...init } = options;
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  if (auth) {
    const token = await getAccessToken();
    if (!token) throw new Error('No hay una sesión iniciada.');
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Revisá tu conexión a internet.'
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let body: any = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const error = buildError(response.status, body);

    // Token vencido: intentamos renovarlo una sola vez y repetimos la request
    if (auth && !alreadyRetried && error.code === 'invalid_token') {
      if (await refreshSession()) {
        return apiRequest<T>(path, options, true);
      }
      await clearSession();
    }

    throw error;
  }

  return body as T;
}

// Etapa 1 de la práctica: comprobar que el backend está activo
export function checkHealth() {
  return apiRequest<unknown>('/health');
}