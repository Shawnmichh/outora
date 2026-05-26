import { API_BASE_URL } from './config';

export class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function parseErrorMessage(payload, status) {
  if (!payload || typeof payload !== 'object') {
    return `Request failed with status ${status}.`;
  }

  if (typeof payload.detail === 'string') {
    return payload.detail;
  }

  const fieldMessages = Object.entries(payload)
    .map(([field, errors]) => {
      const text = Array.isArray(errors) ? errors.join(' ') : String(errors);
      return `${field}: ${text}`;
    })
    .join(' ');

  return fieldMessages || `Request failed with status ${status}.`;
}

/**
 * Sends HTTP request with proper credential handling for HttpOnly cookie authentication.
 *
 * Key behavior:
 * - credentials: 'include' enables sending/receiving cookies in cross-origin requests
 * - Backend must respond with Access-Control-Allow-Credentials: true header
 * - This is automatically handled by Django corsheaders middleware when CORS_ALLOW_CREDENTIALS=True
 *
 * @param {string} path - API endpoint path
 * @param {object} options - Request options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {object} [options.body] - Request body (auto-serialized to JSON)
 * @param {object} [options.headers] - Custom headers
 * @returns {Promise<object>} Parsed response data
 * @throws {ApiError} On request failure
 */
export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      // Include credentials (HttpOnly cookies) in all requests including cross-origin
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Unable to reach the server. Make sure the Django backend is running at ' +
        `${API_BASE_URL}.`,
    );
  }

  let payload = null;
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    payload = await response.json();
  }

  if (!response.ok) {
    const error = new ApiError(parseErrorMessage(payload, response.status), {
      status: response.status,
      details: payload,
    });
    
    // Attach response status for caller to handle gracefully
    error.response = { status: response.status };
    
    throw error;
  }

  return payload;
}
