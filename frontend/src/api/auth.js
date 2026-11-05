// Calls to the backend login API (see "How login works" in the README).
// Paths start with /api, which Vite forwards to the backend during development.
const AUTH_URL = '/api/v1/auth';

const NETWORK_ERROR = 'Cannot reach the server. Please check your connection and try again.';
const UNKNOWN_ERROR = 'Something went wrong. Please try again.';

// Sends a POST request and returns the JSON body, or throws an Error with a message to show the user.
async function post(path, { body, token } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${AUTH_URL}${path}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch only throws when the request never got an answer (server down, no network).
    throw new Error(NETWORK_ERROR);
  }

  // 204 No Content has no body to read.
  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    // The backend sends {"status", "error", "message"}; show its message when there is one.
    throw new Error(data?.message ?? UNKNOWN_ERROR);
  }
  return data;
}

/** Logs in and returns { token, expiresAt, userId, name, role }. */
export function login(email, password) {
  return post('/login', { body: { email, password } });
}

/** Tells the backend the user is logging out. The caller must still delete its copy of the token. */
export async function logout(token) {
  try {
    await post('/logout', { token });
  } catch {
    // If the token has already expired, or the server is unreachable, the user is logged out anyway.
  }
}
