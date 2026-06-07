const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type FetchOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export async function api<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Error en la solicitud') as Error & { role?: string };
    error.role = data.role;
    throw error;
  }

  return data;
}
