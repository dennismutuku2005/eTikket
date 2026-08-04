const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '') : 'http://localhost:4010') + '/api';

/** Returns the public backend base URL (without /api) for static assets like images */
export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
  : 'http://localhost:4010';

/**
 * Typed error thrown when the server returns a 401 Unauthorized.
 * Callers can catch this specifically to redirect to login.
 */
export class AuthError extends Error {
  constructor(message = 'Session expired. Please log in again.') {
    super(message);
    this.name = 'AuthError';
    this.status = 401;
  }
}

/**
 * Call this whenever you catch an AuthError to clear the cookie and redirect.
 * Safe to call in client components — does nothing during SSR.
 */
export function handleAuthError(role = 'organizer') {
  if (typeof window === 'undefined') return;
  document.cookie = 'etikket-session=; Max-Age=0; path=/';
  const loginPaths = {
    organizer: '/organizer/login',
    admin: '/admin/login',
    gate_staff: '/gatestaff/login',
  };
  window.location.replace(loginPaths[role] || '/organizer/login');
}

export async function apiRequest(path, options = {}) {
  const { headers: extraHeaders, ...restOptions } = options;
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(extraHeaders || {}),
      },
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();

    // 401 → session expired / invalid token
    if (response.status === 401) {
      throw new AuthError(typeof data === 'string' ? data : data.message || 'Session expired.');
    }

    if (!response.ok) {
      throw new Error(typeof data === 'string' ? data : data.message || 'Request failed');
    }

    return data;
  } catch (err) {
    if (err instanceof AuthError) throw err; // let callers handle this
    if (err.name === 'TypeError' && (err.message === 'Failed to fetch' || err.message.includes('fetch'))) {
      throw new Error('Cannot reach the server. Please check your connection.');
    }
    throw err;
  }
}

/**
 * Same as apiRequest but automatically attaches a Bearer token.
 * @param {string} path - API path e.g. '/events/mine'
 * @param {string} token - JWT token from session
 * @param {object} [options] - fetch options (method, body, etc.)
 */
export async function apiRequestAuth(path, token, options = {}) {
  return apiRequest(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Upload a file (multipart) to the backend with auth.
 * @param {string} path
 * @param {string} token
 * @param {FormData} formData
 */
export async function apiUpload(path, token, formData) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();

    if (response.status === 401) {
      throw new AuthError(typeof data === 'string' ? data : data.message || 'Session expired.');
    }
    if (!response.ok) {
      throw new Error(typeof data === 'string' ? data : data.message || 'Upload failed');
    }
    return data;
  } catch (err) {
    if (err instanceof AuthError) throw err;
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Cannot reach the server. Please check your connection.');
    }
    throw err;
  }
}
